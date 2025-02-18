"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://47.130.76.132:8080/order/payment",
          {
            headers: {
              Authorization: `${token}`,
              Accept: "application/json",
            },
          }
        );
        setPayments(response.data);
      } catch (err) {
        setError("구매내역을 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const fetchPaymentDetails = async (paymentId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://47.130.76.132:8080/order/payment/${paymentId}`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json",
          },
        }
      );

      setSelectedPayments(response.data);

      const total = response.data.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      setTotalPrice(total);

      setModalOpen(true);
    } catch (err) {
      console.error("상세정보를 가져오는데 실패했습니다.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPayments([]);
    setTotalPrice(0);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="mb-10 p-6 bg-gray-100 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">구매 내역</h2>
      {payments.length === 0 ? (
        <p className="text-gray-500 text-center">구매 내역이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.paymentId}
              className="border p-4 rounded-xl shadow-lg bg-gray-50 transition-all duration-300 hover:shadow-xl cursor-pointer"
              onClick={() => fetchPaymentDetails(payment.paymentId)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{payment.orderItem}</h3>
                <span className="text-sm text-gray-500">{payment.orderDate}</span>
              </div>
              <p className="text-sm text-gray-600">구매자: {payment.buyerEmail}</p>
              <p className="text-sm text-gray-600">주문 번호: {payment.paymentId}</p>
              <p className="text-lg font-bold text-blue-600 mt-2">
                총 가격: {payment.totalPrice.toLocaleString()} 원
              </p>
            </div>
          ))}
        </div>
      )}
      {modalOpen && selectedPayments.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">주문 상세정보</h2>
            
            {/* 주문 상품 */}
            <div className="mb-6 p-4 bg-gray-100 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 주문 상품</h3>
              {selectedPayments.map((payment) => (
                <div key={payment.paymentId} className="flex items-start gap-4 pb-4 mb-4">
                  <img src={payment.imageUrl} alt="상품 이미지" className="w-24 h-24 object-cover rounded-lg shadow-md" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{payment.itemName}</p>
                    <p className="text-gray-600 text-sm">옵션: {payment.options}</p>
                    <p className="text-gray-700 text-sm">수량: {payment.totalAmount}개</p>
                    <p className="text-gray-700 font-bold">가격: {payment.totalPrice.toLocaleString()} 원</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 배송지 */}
            <div className="mb-6 p-4 bg-gray-100 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">📍 배송지</h3>
              <p className="text-gray-700">{selectedPayments[selectedPayments.length - 1].buyerName}</p>
              <p className="text-gray-700">{selectedPayments[selectedPayments.length - 1].email}</p>
              <p className="text-gray-700">{selectedPayments[selectedPayments.length - 1].buyerAddress}</p>
              <p className="text-gray-700">{selectedPayments[selectedPayments.length - 1].buyerPhone}</p>
            </div>

            {/* 총 주문 가격 */}
            <div className="mb-6 p-6 bg-gray-200 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800">💰 주문금액 </h3>
              <p className="text-2xl font-bold text-blue-700 mt-2">{totalPrice.toLocaleString()} 원</p>
            </div>

            <button
              onClick={closeModal}
              className="mt-6 w-full py-3 rounded-lg text-black font-semibold text-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 transition-transform duration-200"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentList;
