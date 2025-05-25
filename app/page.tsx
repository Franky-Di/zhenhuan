"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import HomePage from "@/components/HomePage";

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="zhen-huan-theme">
      <HomePage />
    </ThemeProvider>
  );
}