'use client'

import { useEffect, useState } from "react";
import axios from "axios";

interface Report {
    reportId: number;
    email: string;
    rpEmail: string;
    content: string;
    isCheck: number;
}

export default function EachReport({ params }: { params: { id: number } }) {
    const [report, setReport] = useState<Report | null>(null); // 초기값을 null로 설정
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const reportId = params.id;

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token =
                    "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImtpbmdAc3dpbmdzLmNvbSIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzM5OTM2ODEwLCJleHAiOjE3Mzk5NzI4MTB9.8RFlmq2d4PI-vfYFOPrUtUqksO9dTVIs0dThOyXQq1Y";

                const api = axios.create({
                    baseURL: "http://47.130.76.132:8080",
                    withCredentials: true,
                });

                const response = await api.get(`/admin/report/${reportId}`, {
                    headers: {
                        Authorization: `${token}`,
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
    }, [reportId]); // reportId가 변경될 때만 실행

    // ✅ 로딩 중이면 표시
    if (loading) return <p>Loading...</p>;

    // ✅ 오류 발생 시 표시
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                            신고번호
                        </th>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                            신고자
                        </th>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                            신고 대상
                        </th>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                            내용
                        </th>
                        <th style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                            확인 여부
                        </th>
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
                                    <span style={{ color: "red" }}>Unchecked</span>
                                ) : (
                                    <span style={{ color: "green" }}>Checked</span>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
