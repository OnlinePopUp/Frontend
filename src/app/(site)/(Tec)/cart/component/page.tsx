"use client";

import React, { useEffect, useState } from "react";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("토큰을 찾을 수 없습니다.");
                }

                const response = await fetch("/cart", {
                    method: "GET",
                    headers: {
                        "Authorization": `${token}`,
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP 오류 Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("장바구니 데이터 확인:", data);
                setCartItems(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // 장바구니 아이템 삭제 함수
    const removeItem = async (cartId: any) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("토큰을 찾을 수 없습니다.");
                return;
            }
            // 수량이 0이 되면 삭제 메소드 호출 
            const response = await fetch(`/cart/${cartId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `${token}`,
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`삭제 실패! 상태 코드: ${response.status}`);
            }

            // UI에서 삭제
            setCartItems((prevItems) => prevItems.filter((item: any) => item.cartId !== cartId));

        } catch (error: any) {
            alert(`장바구니에서 삭제하는 중 오류 발생: ${error.message}`);
        }
    };

    // 수량 변경 함수 (0이 되면 삭제)
    const updateAmount = (cartId: any, newAmount: any) => {
        if (newAmount <= 0) {
            removeItem(cartId);
        } else {
            setCartItems((prevItems: any) =>
                prevItems.map((item: any) =>
                    item.cartId === cartId ? { ...item, amount: newAmount } : item
                )
            );
        }
    };

    // 총 금액 계산
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.amount, 0);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">장바구니</h2>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">이메일</th>
                        <th className="border border-gray-300 px-4 py-2">상품명</th>
                        <th className="border border-gray-300 px-4 py-2">수량</th>
                        <th className="border border-gray-300 px-4 py-2">이미지</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.cartId} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <div className="flex items-center justify-center space-x-2">
                                    <button
                                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                                        onClick={() => updateAmount(item.cartId, item.amount - 1)}
                                    >
                                        ➖
                                    </button>
                                    <input
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) =>
                                            updateAmount(item.cartId, parseInt(e.target.value, 10) || 1)
                                        }
                                        className="w-16 text-center p-2 border rounded"
                                    />
                                    <button
                                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                                        onClick={() => updateAmount(item.cartId, item.amount + 1)}
                                    >
                                        ➕
                                    </button>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <img
                                    src={item.imageUrl}
                                    alt={item.itemName}
                                    className="w-20 h-20 object-cover mx-auto"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 총 금액 및 주문하기 버튼 */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-xl font-bold">총 금액: {totalPrice.toLocaleString()} 원</p>
                <button className="bg-blue-500 text-black px-6 py-3 rounded hover:bg-blue-600">
                    주문하기
                </button>
            </div>
        </div>
    );
};

export default Cart;