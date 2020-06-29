
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