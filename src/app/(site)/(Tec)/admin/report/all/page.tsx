'use client'

import React from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import Link from 'next/link';
import "./../../../globals.css";
import "./admin.css";

const data = () => {
    const reports = [];
    for (let i = 1; i < 241; i++) {
        const report = {
            id: i,
            content: `자꾸 사용자${241 - i}가 열받게함`,
            email: `user${i}@example.com`,
            rp_email: `user${241 - i}@example.com`,
            isCheck: i % 2 === 0 ? 1 : 0
        };
        reports.push(report);
    }
    return reports;
}

const columns: GridColDef[] = [
    { field: 'id', headerName: '신고번호', width: 110, resizable: false, },
    { field: 'content', headerName: '신고 내용', width: 300, resizable: false, },
    { field: 'email', headerName: '신고자', width: 250, resizable: false,},
    { field: 'rp_email', headerName: '신고 대상', width: 250, resizable: false, },
    { field: 'isCheck', headerName: '관리자 확인 유무', width: 150, resizable: false, },
    { field: 'withdraw', headerName: '탈퇴 처리', width: 100, renderCell: (params) => {
        return <button className="withDrawBtn">탈퇴</button>;
        }
    },
];
  
export default function AdminUserList() {
    return (
        <div>
            <DataGrid
                initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                rows={data()}
                columns={columns}
                slots={{
                    toolbar: GridToolbar,
                }}
            />
        </div>
    );
}