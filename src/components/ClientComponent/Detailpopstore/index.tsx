import React from "react";
import ProductDetail from "./ProductDetail";
import shopData from "@/components/ClientComponent/Shop/shopData";

const DetailPopstore = () => {
  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Product Details
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {shopData.slice(0, 6).map((item, key) => (
            <ProductDetail item={item} key={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailPopstore;