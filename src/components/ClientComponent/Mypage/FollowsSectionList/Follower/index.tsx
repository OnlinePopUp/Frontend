"use client";
import React from "react";
import Link from "next/link"; // ✅ Next.js Link 사용

interface FollowerProps {
  followerNicknames: string[];
  followerEmails: string[];
  followerCount: number;
  followingEmails: string[]; // ✅ undefined 방지 위해 기본값 필요
}

const Follower: React.FC<FollowerProps> = ({
  followerNicknames,
  followerEmails,
  followerCount,
  followingEmails = [], // ✅ 기본값 설정 (빈 배열)
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700">
        팔로워 ({followerCount}명)
      </h3>
      {followerNicknames.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {followerNicknames.map((nickname, index) => {
            const isMutualFollow = (followingEmails || []).includes(followerEmails[index]); // ✅ undefined 방지

            return (
              <li
                key={index}
                className="flex justify-between items-center p-3 border border-gray-2 rounded-lg bg-white shadow text-dark-DEFAULT"
              >
                <div>
                  {/* ✅ 닉네임을 클릭하면 해당 유저의 마이페이지로 이동 */}
                  <Link
                    href={`/mypage?email=${followerEmails[index]}`}
                    className="text-blue-500 hover:underline"
                  >
                    <p className="text-lg font-medium">{nickname}</p>
                  </Link>
                  <p className="text-sm text-gray-500">{followerEmails[index]}</p>
                </div>
                {isMutualFollow && (
                  <span className="text-xs font-medium text-green-600 px-2 py-1 bg-green-200 rounded-lg">
                    맞팔로우 ✅
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-center mt-2">아직 팔로워가 없습니다.</p>
      )}
    </div>
  );
};

export default Follower;
