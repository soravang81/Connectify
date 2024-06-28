'use client';
import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '../utils/theme/theme';
import { connect } from '../utils/socket/io';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '../components/ui/toaster';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    async function connectt(){
      await connect();
    }
    connectt()
  },[]);
  console.log("rerenderwebsite")

  return (
    <SessionProvider>
      <RecoilRoot>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
          <ToastContainer>
          </ToastContainer>
          <Toaster/>
          {children}
        </ThemeProvider>
      </RecoilRoot>
    </SessionProvider>
  );
};