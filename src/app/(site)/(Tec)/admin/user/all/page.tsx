'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import "./../../../globals.css";
import "./adminUser.css";
  
interface User {
    email: string;
    address: string;
    phone: string;
    role: string;
    nickname: string;
    birth: string;
}

export default function AdminUserList() {
    const [users, setUsers] = useState<User[]>([]);
    const api = axios.create({
        baseURL: "http://47.130.76.132:8080",
        withCredentials: true,
    });


    useEffect(() => {
        const response = api.get("/admin/user/all?size=100&page=0")
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                alert(error);
            });        
    }, []);

    const withdrawUser = (email: string) => {
        const formData = new FormData();

        formData.append("email", email);
        
        try {
            const response = api.post("/user/delete",
                formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",  // form-data 형식 명시
                    },
                }
            )
            alert(`사용자 ${email} 탈퇴 처리`);
        } catch(error) {
            alert(`사용자 ${email} 탈퇴 처리에 실패하였습니다.`);
        }
      };

    const columns: GridColDef[] = [
        { field: 'email', headerName: '이메일', width: 230 },
        { field: 'address', headerName: '주소', width: 150 },
        { field: 'phone', headerName: '전화번호', width: 130 },
        { field: 'role', headerName: '구분', width: 120 },
        { field: 'nickname', headerName: '닉네임', width: 200 },
        { field: 'birth', headerName: '생일', width: 130 },
        { field: 'withdraw', headerName: '탈퇴 처리', width: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => withdrawUser(params.row.email)}
                >
                탈퇴
                </Button>
            ),
        },
    ];

    return (
        <div style={{ height: 650, width: '100%' }}>
      <DataGrid
        className="userTable"
        rows={users}
        columns={columns}
        getRowId={(row) => row.email}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </div>
    );
}