"use client";
import React, { useState, useEffect , useCallback  } from "react";
import axios from "@/utils/axiosConfig";
import { useRouter } from "next/navigation";

const Posted = () => {
  const [posts, setPosts] = useState<any[][]>([]);
  const [nicknames, setNicknames] = useState<string[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(30); // ✅ 초기 페이지 10개
  const [pageSize, setPageSize] = useState(6); // ✅ size=6 고정
  const [searchCategory, setSearchCategory] = useState("name");
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const fetchPosts = useCallback(async () => {
    try {
      let updatedPosts: any[][] = [];
      let updatedNicknames: string[][] = [];
      let validPages: number[] = [];

      for (let i = 0; i < 10; i++) {
        console.log(`🔹 서버에 GET 요청: /post/all?size=${pageSize}&page=${i}`);
        const response = await axios.get(`/post/all?size=${pageSize}&page=${i}`);

        if (
          response.data &&
          Array.isArray(response.data.board) &&
          response.data.board.length > 0
        ) {
          updatedPosts.push(response.data.board);
          updatedNicknames.push(response.data.nickname || []);
          validPages.push(i);
        }
      }

      setPosts(updatedPosts);
      setNicknames(updatedNicknames);
      setTotalPages(validPages.length);
      setCurrentPage(0);
    } catch (error: any) {
      console.error("🚨 게시글 가져오기 실패:", error.response?.data || error.message);
    }
  }, [pageSize]);

  useEffect(() => {
    if (!isSearching) {
      fetchPosts();
    }
  }, [isSearching, fetchPosts]);


  // ✅ 검색 요청
  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setIsSearching(true);

    try {
      console.log(`🔹 서버에 GET 요청: /post/search?category=${searchCategory}&keyword=${keyword}&size=999&page=0`);
      const response = await axios.get(`/post/search`, {
        params: { category: searchCategory, keyword, size: 999, page: 0 },
      });

      if (response.data && Array.isArray(response.data.board)) {
        setPosts([response.data.board]);
        setNicknames([response.data.nickname || []]);
        setTotalPages(1);
        setCurrentPage(0);
      } else {
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">게시글 목록</h2>
        <button
          onClick={fetchPosts}
          className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-all"
        >
          새로고침 🔄
        </button>
      </div>

      <button
        onClick={() => router.push("/create-reviews")}
        className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-blue-light-2 transition-all"
      >
        ✍️ 게시글 작성
      </button>

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

              {userEmail === post.email && (
                <button
                  className="px-3 py-2 bg-blue-500 text-black text-sm rounded-lg hover:bg-blue-light-2 transition-all"
                  onClick={() => {
                    const accessToken = localStorage.getItem("accessToken");
                    if (!accessToken) {
                      alert("로그인이 필요합니다!");
                      return;
                    }
                    router.push(`/reviews/update-reviews?boardId=${post.boardId}&accessToken=${encodeURIComponent(accessToken)}`);
                  }}
                >
                  수정 ✏️
                </button>
              )}
            </li>
          ))}

          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded-lg ${
                  index === currentPage ? "bg-blue-500 text-black" : "bg-gray-300 text-black"
                }`}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </ul>
      ) : (
        <p className="text-gray-500 text-center">게시글이 없습니다.</p>
      )}
    </section>
  );
};

export default Posted;
