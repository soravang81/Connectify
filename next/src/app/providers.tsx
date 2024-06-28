'use client';
import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '../utils/theme/theme';
import { connect } from '../utils/socket/io';
import { ToastContainer } from 'react-toastify';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // async function connectt(){
    //   await connect();
    // }
    connect()
  },[]);
  return (
    <SessionProvider>
      <RecoilRoot>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
          <ToastContainer>
          </ToastContainer>
          {children}
        </ThemeProvider>
      </RecoilRoot>
    </SessionProvider>
  );
};