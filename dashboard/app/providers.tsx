"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, Suspense } from "react";

const Providers = ({ children }: { children: ReactNode }) => (
  <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}>
    <Suspense></Suspense>
    {children}
  </SessionProvider>
);

export default Providers;
