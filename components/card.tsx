import { ReactNode, type CSSProperties } from "react";
import classNames from "classnames";

export default function Card({
  children,
  className,
  style,
}: {
  className?: string;
  children: ReactNode;
  style?