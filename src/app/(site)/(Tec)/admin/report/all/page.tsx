'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from "axios";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import "./../../../globals.css";
import "./admin.css";

interface Report {
    reportId: number,
    email: string,
    reported: string,
    reason: string,
    isCheck: number
};
  
export default function AdminUserList() {
    const columns: GridColDef[] = [
        { field: 'reportId', headerName: '신고번호', width: 110, resizable: false, },
        { field: 'content', headerName: '신고 내용', width: 300, resizable: false, },
        { field: 'email', headerName: '신고자', width: 250, resizable: false,},
        { field: 'rpEmail', headerName: '신고 대상', width: 250, resizable: false, },
        { field: 'isCheck', headerName: '관리자 확인 유무', width: 150, resizable: false, },
        { field: 'check', headerName: '내용 확인', width: 100, renderCell: (params) => {
            return <button className="withDrawBtn" onClick={() => checkReport(params.row.reportId)}>확인</button>;
            }
        },
    ];

    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const checkReport = (reportId: number) => router.push(`/admin/report/${reportId}`);

    useEffect(() => {
        try {
            const token = localStorage.getItem("accessToken");

            const api = axios.create({
                baseURL: "http://47.130.76.132:8080",
                withCredentials: true,
            });
    
            const response = api.get("/admin/report/all?size=100&page=0")
                .then((response) => {
                    setReports(response.data);
                })
                .catch((error) => {
                    alert(error);
                }
            );
        } catch (error) {
            throw new Error("토큰을 찾을 수 없습니다.");
        }
    }, [router]);

    return (
        <div>
            <DataGrid
                initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                rows={reports}
                columns={columns}
                getRowId={(row) => row.reportId}
                slots={{
                    toolbar: GridToolbar,
                }}
            />
        </div>
    );
}