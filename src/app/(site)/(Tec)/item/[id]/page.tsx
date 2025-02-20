"use client";

import React from "react";
import { useParams } from "next/navigation";
import ItemDetail from "../component/ItemDetail";

const ItemDetailPage = () => {
    const params = useParams();
    const rawItemId = params?.itemId;

    // ✅ `string | string[] | undefined` → `string`으로 변환
    const itemId: string | undefined = Array.isArray(rawItemId) ? rawItemId[0] : rawItemId;

    if (!itemId) {
        return <p>Error: 아이템 ID가 존재하지 않습니다.</p>;
    }

    return <ItemDetail itemId={itemId} />;
};

export default ItemDetailPage;
