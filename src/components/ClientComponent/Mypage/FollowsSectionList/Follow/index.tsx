"use client";
import React from "react";
import Link from "next/link"; // ✅ Next.js Link 사용

interface FollowProps {
  followingNicknames: string[];
  followingEmails: string[];
  followingCount: number;
  handleUnfollow: (flwEmail: string) => void;
  isMyPage: boolean; // ✅ 본인 계정 여부 확인
}

const Follow: React.FC<FollowProps> = ({
  followingNicknames,
  followingEmails,
  followingCount,
  handleUnfollow,
  isMyPage,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-700">
        팔로잉 ({followingCount}명)
      </h3>
      {followingNicknames.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {followingNicknames.map((nickname, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-3 border border-gray-2 rounded-lg bg-white shadow text-dark-DEFAULT"
            >
              <div>
                {/* ✅ 닉네임을 클릭하면 해당 유저의 마이페이지로 이동 */}
                <Link
                  href={`/mypage?email=${followingEmails[index]}`}
                  className="text-blue-500 hover:underline"
                >
                  <p className="text-lg font-medium">{nickname}</p>
                </Link>
                <p className="text-sm text-gray-500">{followingEmails[index]}</p>
              </div>
              {/* ✅ 본인 계정일 경우만 언팔로우 버튼 표시 */}
              {isMyPage && (
                <button
                  onClick={() => handleUnfollow(followingEmails[index])}
                  className="px-4 py-2 text-sm text-black bg-red-500 rounded-lg hover:bg-dark-2 transition-all duration-200"
                >
                  언팔로우
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center mt-2">아직 팔로우한 사용자가 없습니다.</p>
      )}
    </div>
  );
};

export default Follow;
