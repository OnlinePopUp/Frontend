"use client";
import Detail from "@/components/ClientComponent/Reviews/Detail/Detail";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <Detail />;
    </Suspense>)
};

export default Page;
