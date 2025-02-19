"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Item from "@/components/ClientComponent/Item/Item";

const ItemPage = () => { 
    const router = useRouter();

    // 아이템 클릭 시 상세 페이지로 이동
    const handleItemClick = (itemId) => {
        router.push(`/item/${itemId}`);
    };

    return <Item onItemClick={handleItemClick} />;
};

export default ItemPage;
