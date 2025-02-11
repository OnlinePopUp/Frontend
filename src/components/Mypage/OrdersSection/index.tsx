import React from "react";

const OrdersSection = ({ orderHistory = [] }) => {
  return (
    <section id="orders" className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Order History</h2>
      {orderHistory.length > 0 ? (
        <div className="space-y-4">
          {orderHistory.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium">Order #{order.id}</h3>
              <p className="text-gray-500">Date: {order.date}</p>
              <ul className="list-disc list-inside">
                {order.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="font-semibold mt-2">Total: {order.total}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No recent orders found.</p>
      )}
    </section>
  );
};

export default OrdersSection; 
