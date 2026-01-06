"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
