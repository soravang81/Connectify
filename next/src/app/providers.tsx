'use client';
import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '../utils/theme/theme';
import { connect } from '../utils/socket/io';
import { ToastContainer } from 'react-toastify';
import { Toaster as Toasterr } from '../components/ui/toaster';
import { Toaster } from "../components/ui/sonner"
import { useTheme } from 'next-themes';



export const Providers = ({ children }: { children: React.ReactNode }) => {
  const {theme} = useTheme()
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
          <Toaster  position='top-right' expand={false} theme={theme as any}  />
          <Toasterr/>
          {children}
        </ThemeProvider>
      </RecoilRoot>
    </SessionProvider>
  );
};