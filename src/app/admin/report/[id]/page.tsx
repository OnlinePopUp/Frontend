'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

interface Report {
    reportId: number,
    email: string,
    rpEmail: string,
    content: string,
    isCheck: number
};

export default function eachReport({ params }: { params: { id: number }}) {
    const [report, setReport] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const reportId = params.id;
    
    useEffect(() => {
        try {
            //const token = localStorage.getItem("accessToken");
            const token = "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImtpbmdAc3dpbmdzLmNvbSIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzM5OTM2ODEwLCJleHAiOjE3Mzk5NzI4MTB9.8RFlmq2d4PI-vfYFOPrUtUqksO9dTVIs0dThOyXQq1Y";

            const api = axios.create({
                baseURL: "http://47.130.76.132:8080",
                withCredentials: true,
            });
    
            const response = api.get(`/admin/report/${reportId}`, {
                headers: {
                    "Authorization": `${token}`
                }
            })
                .then((response) => {
                    setReport(response.data);
                })
                .catch((error) => {
                    alert(error);
                }
            );
        } catch (error) {
            throw new Error("토큰을 찾을 수 없습니다.");
        }
    })


    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
                    <tr key={report?.reportId}>
                        <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                            {report?.reportId}
                        </td>
                        <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                            {report?.email}
                        </td>
                        <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                            {report?.rpEmail}
                        </td>
                        <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                            {report?.content}
                        </td>
                        <td style={{ paddingTop: "8px", paddingBottom: "8px", textAlign: "center" }}>
                            {report?.isCheck === 0 ? (
                            <span style={{ color: "red" }}>Unchecked</span>
                            ) : (
                            <span style={{ color: "green" }}>Checked</span>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}