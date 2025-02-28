'use client'

import { useState, useEffect } from 'react';
import stompClient from "@/components/ClientComponent/Alram/MessageAlram/MessageAlram";

export default function MessageAlert() {
    const userEmail = localStorage.getItem("userEmail");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handleMessage = (message) => {
            const data = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, data]);
        };
      
        // 기존에 subscribe한 클라이언트에 메시지 핸들러 추가
        stompClient.subscribe(`/chat/sub/${userEmail}`, handleMessage);
      
        return () => {
            // 컴포넌트 언마운트 시 정리
            stompClient.unsubscribe(`/chat/sub/${userEmail}`);
        };
    }, []);

    return (
        <div>
            <h4 className='ml-10 text-4xl'>받은 메시지</h4>
            {messages.map((msg, index) => (
                    <h3 key={index}>{msg.content}</h3>
            ))}
        </div>
    );
}