
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Preahvihear, Space_Grotesk } from "next/font/google";
import classNames from "classnames";
import BackgroundGradient from "../components/background-gradient";
import Card from "../components/card";
import { MouseEvent, useCallback, useRef, useState } from "react";
import client from "../config-client";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",