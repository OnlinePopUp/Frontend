"use client";
import React from "react";
import Image from "next/image";

const followingList = [
  { id: 1, name: "TechWorld", avatar: "/images/avatars/techworld.png" },
  { id: 2, name: "GadgetGeek", avatar: "/images/avatars/gadgetgeek.png" },
  { id: 3, name: "InnovateHub", avatar: "/images/avatars/innovatehub.png" },
];

const FollowsSection = () => {
  return (
    <section id="follows" className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Following</h2>
      {followingList.length > 0 ? (
        <div className="space-y-4">
          {followingList.map((follow) => (
            <div
              key={follow.id}
              className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={follow.avatar}
                alt={follow.name}
                width={50}
                height={50}
                className="rounded-full border-2 border-gray-300"
              />
              <div>
                <h3 className="text-lg font-medium">{follow.name}</h3>
                <button className="mt-1 px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">
                  Unfollow
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You are not following anyone yet.</p>
      )}
    </section>
  );
};

export default FollowsSection;
