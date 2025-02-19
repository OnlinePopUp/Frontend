import React from "react";
import Image from "next/image";
import axios from "@/utils/axiosConfig";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const popupStores = [
  {
    id: 1,
    title: "트렌드 리빙 팝업스토어",
    description: "인기있는 리빙 아이템을 팝업스토어에서 만나보세요!",
    products: [
      { id: 101, name: "미니 테이블 램프", price: "₩29,900", image: "/lamp.jpg", description: "아늑한 조명을 연출하는 테이블 램프입니다. 따뜻한 분위기를 연출할 수 있습니다." },
      { id: 102, name: "모던 원목 의자", price: "₩79,000", image: "/chair.jpg", description: "미니멀한 디자인의 원목 의자로, 어느 공간에서도 세련된 인테리어를 완성할 수 있습니다." },
    ],
  },
  {
    id: 2,
    title: "패션 & 액세서리 팝업",
    description: "최신 유행하는 패션 아이템을 한 자리에서!",
    products: [
      { id: 201, name: "가죽 미니백", price: "₩45,000", image: "/bag.jpg", description: "작지만 실용적인 수납이 가능한 미니백으로, 데일리룩에 완벽한 포인트가 됩니다." },
      { id: 202, name: "트렌디 선글라스", price: "₩19,900", image: "/sunglasses.jpg", description: "세련된 디자인의 선글라스로 어떤 스타일에도 잘 어울리며, 자외선 차단 기능까지 갖추고 있습니다." },
    ],
  },
  {
    id: 3,
    title: "테크 & 가전 팝업",
    description: "최신 IT 기기와 가전을 직접 체험하세요!",
    products: [
      { id: 301, name: "무선 이어폰", price: "₩99,000", image: "/earbuds.jpg", description: "고음질 사운드와 장시간 배터리 수명을 제공하는 프리미엄 무선 이어폰입니다." },
      { id: 302, name: "스마트 워치", price: "₩199,000", image: "/watch.jpg", description: "건강 모니터링 기능이 포함된 스마트 워치로, 다양한 운동 모드와 함께 사용할 수 있습니다." },
    ],
  },
];

const Main: React.FC = () => {
  return (
    <div className="bg-popup-bg bg-cover bg-center min-h-screen relative">
      {popupStores.map((store) => (
        <div key={store.id} className="container mx-auto py-16">
          <div className="text-center">
            {/* ✅ hover 시 밑줄 추가 */}
            <h2 className="text-heading-2 font-semibold text-blue-600 hover:underline hover:text-blue-800 transition-all cursor-pointer">
              {store.title}
            </h2>
            <p className="text-custom-lg mt-4">{store.description}</p>
          </div>

          {/* ✅ 공백을 줄이기 위해 `flex` 추가 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {store.products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-2 hover:shadow-3 transition flex gap-6"
              >
                {/* 이미지 */}
                <Image
                  src={product.image}
                  alt={product.name}
                  width={250}
                  height={250}
                  className="object-contain rounded-lg flex-shrink-0"
                  quality={90}
                />

                {/* 상품 정보 (제목, 가격, 설명) */}
                <div className="flex flex-col justify-center flex-grow">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-lg font-semibold text-blue-600 mt-2">{product.price}</p>
                  <p className="text-base text-gray-700 mt-2 leading-relaxed">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <footer className="bg-dark text-white py-6 text-center">
        <p>© 2025 Popup Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Main;
