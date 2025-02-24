import Signin from "@/components/ClientComponent/Auth/Signin";
import React from "react";
import { Metadata } from "next";

import Head from "next/head";  // Head 컴포넌트 추가

export const metadata: Metadata = {
  title: "Signin Page | NextCommerce Nextjs E-commerce template",
  description: "This is Signin Page for NextCommerce Template",
  // other metadata
};

const SigninPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default SigninPage;
