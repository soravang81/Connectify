"use client"

import { RecoilRoot } from "recoil";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
};

export default RootLayout;
