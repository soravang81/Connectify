'use client';
import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '../utils/theme/theme';
import { connect } from '../utils/socket/io';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    connect();
  },[]);
  return (
    <SessionProvider>
      <RecoilRoot>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </RecoilRoot>
    </SessionProvider>
  );
};