
#!/usr/bin/env node

const {existsSync} = require(`fs`);
const {createRequire} = require(`module`);
const {resolve} = require(`path`);

const relPnpApiPath = "../../../../.pnp.cjs";

const absPnpApiPath = resolve(__dirname, relPnpApiPath);
const absRequire = createRequire(absPnpApiPath);

const moduleWrapper = tsserver => {
  if (!process.versions.pnp) {
    return tsserver;
  }

  const {isAbsolute} = require(`path`);
  const pnpApi = require(`pnpapi`);

  const isVirtual = str => str.match(/\/(\$\$virtual|__virtual__)\//);
  const isPortal = str => str.startsWith("portal:/");
  const normalize = str => str.replace(/\\/g, `/`).replace(/^\/?/, `/`);

  const dependencyTreeRoots = new Set(pnpApi.getDependencyTreeRoots().map(locator => {
    return `${locator.name}@${locator.reference}`;
  }));

  // VSCode sends the zip paths to TS using the "zip://" prefix, that TS
  // doesn't understand. This layer makes sure to remove the protocol
  // before forwarding it to TS, and to add it back on all returned paths.

  function toEditorPath(str) {
    // We add the `zip:` prefix to both `.zip/` paths and virtual paths
    if (isAbsolute(str) && !str.match(/^\^?(zip:|\/zip\/)/) && (str.match(/\.zip\//) || isVirtual(str))) {
      // We also take the opportunity to turn virtual paths into physical ones;
      // this makes it much easier to work with workspaces that list peer
      // dependencies, since otherwise Ctrl+Click would bring us to the virtual
      // file instances instead of the real ones.
      //
      // We only do this to modules owned by the the dependency tree roots.
      // This avoids breaking the resolution when jumping inside a vendor
      // with peer dep (otherwise jumping into react-dom would show resolution
      // errors on react).
      //
      const resolved = isVirtual(str) ? pnpApi.resolveVirtual(str) : str;
      if (resolved) {
        const locator = pnpApi.findPackageLocator(resolved);
        if (locator && (dependencyTreeRoots.has(`${locator.name}@${locator.reference}`) || isPortal(locator.reference))) {
          str = resolved;
        }
      }

      str = normalize(str);

      if (str.match(/\.zip\//)) {
        switch (hostInfo) {
          // Absolute VSCode `Uri.fsPath`s need to start with a slash.
          // VSCode only adds it automatically for supported schemes,
          // so we have to do it manually for the `zip` scheme.
          // The path needs to start with a caret otherwise VSCode doesn't handle the protocol
          //
          // Ref: https://github.com/microsoft/vscode/issues/105014#issuecomment-686760910
          //
          // 2021-10-08: VSCode changed the format in 1.61.
          // Before | ^zip:/c:/foo/bar.zip/package.json
          // After  | ^/zip//c:/foo/bar.zip/package.json
          //
          // 2022-04-06: VSCode changed the format in 1.66.
          // Before | ^/zip//c:/foo/bar.zip/package.json
          // After  | ^/zip/c:/foo/bar.zip/package.json
          //
          // 2022-05-06: VSCode changed the format in 1.68
          // Before | ^/zip/c:/foo/bar.zip/package.json
          // After  | ^/zip//c:/foo/bar.zip/package.json
          //
          case `vscode <1.61`: {
            str = `^zip:${str}`;
          } break;

          case `vscode <1.66`: {
            str = `^/zip/${str}`;
          } break;

          case `vscode <1.68`: {
            str = `^/zip${str}`;
          } break;

          case `vscode`: {
            str = `^/zip/${str}`;
          } break;

          // To make "go to definition" work,
          // We have to resolve the actual file system path from virtual path
          // and convert scheme to supported by [vim-rzip](https://github.com/lbrayner/vim-rzip)
          case `coc-nvim`: {
            str = normalize(resolved).replace(/\.zip\//, `.zip::`);
            str = resolve(`zipfile:${str}`);
          } break;

          // Support neovim native LSP and [typescript-language-server](https://github.com/theia-ide/typescript-language-server)
          // We have to resolve the actual file system path from virtual path,
          // everything else is up to neovim
          case `neovim`: {
            str = normalize(resolved).replace(/\.zip\//, `.zip::`);
            str = `zipfile://${str}`;
          } break;

          default: {
            str = `zip:${str}`;
          } break;
        }
      }
    }

    return str;
  }

  function fromEditorPath(str) {
    switch (hostInfo) {