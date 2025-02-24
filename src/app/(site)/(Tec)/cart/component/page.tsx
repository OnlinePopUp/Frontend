"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface CartItem {
  cartId: number;
  email: string;
  itemName: string;
  amount: number;
  price: number;
  imageUrl: string;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);  // cartItems 타입 지정
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 주문에 필요한 정보
    const [buyName, setBuyName] = useState<string>("");
    const [buyerAddress, setBuyerAddress] = useState<string>("");
    const [buyerPhone, setBuyerPhone] = useState<string>("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("토큰을 찾을 수 없습니다.");
                }

                const response = await fetch("http://47.130.76.132:8080/cart", {
                    method: "GET",
                    headers: {
                        "Authorization": `${token}`,
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP 오류 Status: ${response.status}`);
                }

                const data: CartItem[] = await response.json();
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
    const removeItem = async (cartId: number) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("토큰을 찾을 수 없습니다.");
                return;
            }

            const response = await fetch(`http://47.130.76.132:8080/cart/${cartId}`, {
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
            setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));

        } catch (error: any) {
            alert(`장바구니에서 삭제하는 중 오류 발생: ${error.message}`);
        }
    };

    // 수량 변경 함수 (0이 되면 삭제)
    const updateAmount = (cartId: number, newAmount: number) => {
        if (newAmount <= 0) {
            removeItem(cartId);
        } else {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.cartId === cartId ? { ...item, amount: newAmount } : item
                )
            );
        }
    };

    // 총 금액 계산
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.amount, 0);

    // 주문하기 함수
    const placeOrder = async () => {
        if (!buyName || !buyerAddress || !buyerPhone) {
            alert("주문자 정보를 모두 입력해주세요.");
            return;
        }

        const orderDto = {
            buyName,
            buyerAddress,
            buyerPhone,
            items: cartItems.map(item => ({
                cartId: item.cartId,
                itemName: item.itemName,
                amount: item.amount,
                price: item.price
            }))
        };

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("토큰을 찾을 수 없습니다.");
                return;
            }

            const response = await fetch("http://47.130.76.132:8080/order", {
                method: "POST",
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderDto)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "주문에 실패했습니다.");
            }

            const orderData = await response.json();
            alert(`주문이 성공적으로 완료되었습니다: ${orderData}`);
            setCartItems([]);  // 장바구니 비우기

        } catch (error: any) {
            alert(`주문 중 오류 발생: ${error.message}`);
        }
    };

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
                                <Image
                                    src={item.imageUrl}
                                    alt={item.itemName}
                                    className="w-20 h-20 object-cover mx-auto"
                                    width={80}
                                    height={80}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 주문자 정보 입력 */}
            <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">주문자 정보</h3>
                <div>
                    <label htmlFor="buyName" className="block">주문자 성함</label>
                    <input
                        type="text"
                        id="buyName"
                        value={buyName}
                        onChange={(e) => setBuyName(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />
                </div>
                <div>
                    <label htmlFor="buyerAddress" className="block">배송지</label>
                    <input
                        type="text"
                        id="buyerAddress"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />
                </div>
                <div>
                    <label htmlFor="buyerPhone" className="block">구매자 전화번호</label>
                    <input
                        type="text"
                        id="buyerPhone"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />
                </div>
            </div>

            {/* 총 금액 및 주문하기 버튼 */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-xl font-bold">총 금액: {totalPrice.toLocaleString()} 원</p>
                <button
                    onClick={placeOrder}
                    className="bg-blue-500 text-black px-6 py-3 rounded hover:bg-gray-400"
                >
                    주문하기
                </button>
            </div>
        </div>
    );
};

export default Cart;








