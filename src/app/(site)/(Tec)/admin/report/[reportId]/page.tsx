'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface Report {
    reportId: number;
    email: string;
    rpEmail: string;
    content: string;
    isCheck: number;
}

export default function EachReport() {
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [placeholder, setPlaceholder] = useState("오늘 끌리는 팝업은?"); // 초기 placeholder 설정

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        // 클라이언트에서만 실행되도록 설정
        if (typeof window !== "undefined") {
            setPlaceholder("지금 바로 팝업 검색!"); // 클라이언트에서만 변경
        }
    }, []);

    useEffect(() => {
        if (!id) return; // id가 없으면 데이터 요청하지 않음

        const fetchReport = async () => {
            try {
                const token = "YOUR_JWT_TOKEN"; // 실제 토큰으로 변경
                const api = axios.create({
                    baseURL: "http://47.130.76.132:8080",
                    withCredentials: true,
                });

                const response = await api.get(`/admin/report/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setReport(response.data);
            } catch (error) {
                console.error("데이터 로딩 중 오류 발생:", error);
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]); // id가 변경될 때만 실행

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <input 
                type="text" 
                placeholder={placeholder} // 동적으로 변경된 placeholder
            />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>신고번호</th>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>신고자</th>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>신고 대상</th>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>내용</th>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>확인 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {report && (
                        <tr key={report.reportId}>
                            <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                                {report.reportId}
                            </td>
                            <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                                {report.email ?? "N/A"}
                            </td>
                            <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                                {report.rpEmail ?? "N/A"}
                            </td>
                            <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                                {report.content ?? "No Content"}
                            </td>
                            <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                                {report.isCheck === 0 ? (
                                    <span style={{ color: "red" }}>확인 안됨</span>
                                ) : (
                                    <span style={{ color: "green" }}>확인됨</span>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}