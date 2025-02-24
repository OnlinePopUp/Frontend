"use client";

import UpdateReviews from "@/components/ClientComponent/Reviews/UpdateReviews/UpdateReviews";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateReviews />;
    </Suspense>
  )
};

export default Page;
