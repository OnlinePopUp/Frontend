"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ Next.js의 useRouter 추가

// 검색기능 포함되어있음

const Posted = () => {
  const [posts, setPosts] = useState<any[][]>([]);
  const [nicknames, setNicknames] = useState<string[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(999);
  const [searchCategory, setSearchCategory] = useState("name"); // ✅ 검색 카테고리 (기본: name)
  const [keyword, setKeyword] = useState(""); // ✅ 검색어
  const [isSearching, setIsSearching] = useState(false); // ✅ 검색 여부 상태
  const router = useRouter(); // ✅ Next.js Router 추가

  useEffect(() => {
    const fetchTotalPosts = async () => {
      try {
        console.log(`🔹 서버에 GET 요청: /post/all?size=${pageSize}&page=0`);
        const response = await axios.get(`http://47.130.76.132:8080/post/all?size=${pageSize}&page=0`);
        console.log(`🔹 전체 게시글 응답 데이터:`, response.data);

        if (response.data && Array.isArray(response.data.board)) {
          const totalPosts = response.data.totalElements || response.data.board.length;
          setTotalPages(Math.ceil(totalPosts / 6));
          setPageSize(6);
        } else {
          console.warn("🚨 응답 데이터가 올바르지 않습니다.", response.data);
        }
      } catch (error: any) {
        console.error("🚨 게시글 개수 가져오기 실패:", error.response?.data || error.message);
      }
    };

    fetchTotalPosts();
  }, []);

  const fetchPosts = async (page: number) => {
    if (pageSize === 999) return;

    try {
      console.log(`🔹 서버에 GET 요청: /post/all?size=${pageSize}&page=${page}`);
      const response = await axios.get(`http://47.130.76.132:8080/post/all?size=${pageSize}&page=${page}`);

      console.log(`🔹 ${page}페이지 응답 데이터:`, response.data);

      if (response.data && Array.isArray(response.data.board)) {
        setPosts((prev) => {
          const newPosts = [...prev];
          newPosts[page] = response.data.board;
          return newPosts;
        });

        setNicknames((prev) => {
          const newNicknames = [...prev];
          newNicknames[page] = response.data.nickname || [];
          return newNicknames;
        });
      } else {
        console.warn(`🚨 ${page}페이지 응답 데이터가 올바르지 않습니다.`, response.data);
      }
    } catch (error: any) {
      console.error(`🚨 ${page}페이지 게시글 가져오기 실패:`, error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (totalPages > 0 && !isSearching) {
      fetchPosts(currentPage);
    }
  }, [currentPage, totalPages, isSearching]);

  // ✅ 검색 요청 함수
  const handleSearch = async () => {
    if (!keyword.trim()) return; // 빈 검색어 방지

    setIsSearching(true); // 검색 시작

    try {
      console.log(`🔹 서버에 GET 요청: /post/search?category=${searchCategory}&keyword=${keyword}&size=999&page=0`);
      const response = await axios.get(`http://47.130.76.132:8080/post/search`, {
        params: { category: searchCategory, keyword, size: 999, page: 0 }
      });

      console.log("🔹 검색 결과:", response.data);

      if (response.data && Array.isArray(response.data.board)) {
        const totalPosts = response.data.totalElements || response.data.board.length;
        setTotalPages(Math.ceil(totalPosts / 6));
        setPageSize(6);

        setPosts([response.data.board]); // 검색 결과 저장 (0번째 페이지에 저장)
        setNicknames([response.data.nickname || []]);

        setCurrentPage(0); // 첫 페이지부터 시작
      } else {
        console.warn("🚨 검색 응답 데이터가 올바르지 않습니다.", response.data);
        setPosts([]);
        setTotalPages(0);
      }
    } catch (error: any) {
      console.error("🚨 검색 요청 실패:", error.response?.data || error.message);
      setPosts([]);
      setTotalPages(0);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-yellow-light-2 shadow-md rounded-lg">
      {/* ✅ 게시글 목록 제목 & 새로고침 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">게시글 목록</h2>
        <button
          onClick={() => window.location.reload() } // // 페이지 새로고침
          className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-all"
        >
          새로고침 🔄
        </button>
      </div>

      {/* ✅ 검색 바 추가 */}
      <div className="flex items-center gap-4 mb-4">
        <select
          className="p-2 border rounded-lg"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="name">제목</option>
          <option value="email">작성자 이메일</option>
          <option value="content">내용</option>
        </select>
        <input
          type="text"
          className="p-2 border rounded-lg flex-1"
          placeholder="검색어 입력..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-light-3 text-black rounded-lg hover:bg-blue-light-2 transition-all"
        >
          검색
        </button>
      </div>

      {posts[currentPage] && posts[currentPage].length > 0 ? (
        <ul className="space-y-4">
        {posts[currentPage].map((post, index) => (
          <li key={post.boardId} className="p-4 border bg-yellow-light-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 
                className="text-lg font-medium text-blue-600 cursor-pointer hover:underline"
                onClick={() => router.push(`/reviews/detail?boardId=${post.boardId}`)}
              >
                {post.name}
              </h3>
              <p className="text-sm text-gray-600">{post.content}</p>
              <p className="text-xs text-gray-500">작성자: {nicknames[currentPage]?.[index] || "알 수 없음"}</p>
            </div>
      
            {/* ✅ 수정 버튼 UI */}
            <button
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all"
              onClick={() => {
                const accessToken = localStorage.getItem("accessToken"); // ✅ LocalStorage에서 accessToken 가져오기
                if (!accessToken) {
                  alert("로그인이 필요합니다!"); // ✅ accessToken이 없을 경우 알림
                  return;
                }

                const updateUrl = `/reviews/update-reviews?boardId=${post.boardId}&accessToken=${encodeURIComponent(accessToken)}`;
                router.push(updateUrl); // ✅ 업데이트 페이지로 이동
              }}
            >
              수정 ✏️
            </button>
          </li>
        ))}
      </ul>
      
      ) : (
        <p className="text-gray-500 text-center">게시글이 없습니다.</p>
      )}

      {/* ✅ 페이지네이션 버튼 */}
      {!isSearching && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all duration-200"
            disabled={currentPage === 0}
          >
            이전
          </button>

          <span className="text-gray-700 font-medium">{currentPage + 1} / {totalPages}</span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all duration-200"
            disabled={currentPage >= totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
};

export default Posted;
