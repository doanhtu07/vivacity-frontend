"use client";

import { useEffect } from "react";

import clsx from "clsx";

const LoadBackground = () => {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      document.body.className = clsx(document.body.className, "dark");
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
};

export default LoadBackground;
