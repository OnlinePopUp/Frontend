"use client";
import React from "react";
import Image from "next/image";

const likedItems = [
  { id: 1, name: "Wireless Headphones", price: "$199", img: "/images/items/headphones.png" },
  { id: 2, name: "Smart Watch", price: "$299", img: "/images/items/smartwatch.png" },
  { id: 3, name: "Gaming Console", price: "$499", img: "/images/items/console.png" },
  { id: 4, name: "Bluetooth Speaker", price: "$149", img: "/images/items/speaker.png" },
];

const LikesSection = () => {
  return (
    <section id="likes" className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Liked Items</h2>
      {likedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedItems.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <Image
                src={item.img}
                alt={item.name}
                width={150}
                height={150}
                className="mx-auto mb-4 rounded-md"
              />
              <h3 className="text-lg font-medium text-center mb-2">{item.name}</h3>
              <p className="text-center text-gray-500 mb-4">{item.price}</p>
              <div className="flex justify-center">
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Remove from Likes
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't liked any items yet.</p>
      )}
    </section>
  );
};

export default LikesSection;
