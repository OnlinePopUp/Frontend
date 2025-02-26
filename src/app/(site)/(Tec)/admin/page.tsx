'use client';

import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(`/admin/${path}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-gray shadow-lg rounded-xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🕵️‍♀️관리자 대시보드
        </h1>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigateTo('join')}
            className="w-full bg-white text-black font-semibold py-5 px-6 rounded-lg shadow-md transition-all duration-200 hover:bg-blue"
          >
            관리자 가입 페이지
          </button>

          <button
            onClick={() => navigateTo('report/all')}
            className="w-full bg-white text-black font-semibold py-5 px-6 rounded-lg shadow-md transition-all duration-200 hover:bg-green"
          >
            모든 리포트 보기
          </button>

          <button
            onClick={() => navigateTo('user/all')}
            className="w-full bg-white text-black font-semibold py-5 px-6 rounded-lg shadow-md transition-all duration-200 hover:bg-red"
          >
            모든 사용자 보기
          </button>
        </div>
      </div>
    </div>
  );
}
