"use client";

import React from "react";
import { useParams } from "next/navigation";
import ItemDetail from "@/components/ClientComponent/Item/ItemDetail";

const ItemDetailPage = () => {
    const params = useParams();
    const itemId = params?.itemId;

    if (!itemId) {
        return <p>Error: 아이템 ID가 존재하지 않습니다.</p>;
    }

    return (
            <ItemDetail itemId={itemId} />
    );
};

export default ItemDetailPage;
