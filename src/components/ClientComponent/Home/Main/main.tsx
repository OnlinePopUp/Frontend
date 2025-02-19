import React from "react";
import axios from "@/utils/axiosConfig";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

console.log("Axios Base URL:", axios.defaults.baseURL);

const popupStores = [
  {
    id: 1,
    title: "트렌드 리빙 팝업스토어",
    description: "인기있는 리빙 아이템을 팝업스토어에서 만나보세요!",
    products: [
      { id: 101, name: "미니 테이블 램프", price: "₩29,900", image: "/lamp.jpg" },
      { id: 102, name: "모던 원목 의자", price: "₩79,000", image: "/chair.jpg" },
    ],
  },
  {
    id: 2,
    title: "패션 & 액세서리 팝업",
    description: "최신 유행하는 패션 아이템을 한 자리에서!",
    products: [
      { id: 201, name: "가죽 미니백", price: "₩45,000", image: "/bag.jpg" },
      { id: 202, name: "트렌디 선글라스", price: "₩19,900", image: "/sunglasses.jpg" },
    ],
  },
  {
    id: 3,
    title: "테크 & 가전 팝업",
    description: "최신 IT 기기와 가전을 직접 체험하세요!",
    products: [
      { id: 301, name: "무선 이어폰", price: "₩99,000", image: "/earbuds.jpg" },
      { id: 302, name: "스마트 워치", price: "₩199,000", image: "/watch.jpg" },
    ],
  },
];

const Main: React.FC = () => {
  console.log("Axios Base URL:", axios.defaults.baseURL);
  return (
    <div className="bg-meta text-dark min-h-screen relative">
      {popupStores.map((store) => (
        <div key={store.id} className="container mx-auto py-16">
          {/* 팝업스토어 정보 */}
          <div className="text-center">
            <h2 className="text-heading-2 font-semibold">{store.title}</h2>
            <p className="text-custom-lg mt-4">{store.description}</p>
          </div>

          {/* 상품 리스트 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {store.products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow-2 hover:shadow-3 transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <h3 className="text-lg font-medium mt-4">{product.name}</h3>
                <p className="text-custom-sm text-gray-6 mt-2">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 푸터 */}
      <footer className="bg-dark text-white py-6 text-center">
        <p>© 2025 Popup Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Main;
