"use client";

import React from "react";
import { useParams } from "next/navigation";
import ItemEdit from "../../component/ItemEdit";

const EditItemPage = () => {
    const params = useParams();
    const rawItemId = params?.itemId;

    // ✅ `string | string[] | undefined` → `string` 변환
    const itemId: string | undefined = Array.isArray(rawItemId) ? rawItemId[0] : rawItemId;

    if (!itemId) return <p>Error: 아이템 ID가 존재하지 않습니다.</p>;

    return <ItemEdit itemId={itemId} />;
};

export default EditItemPage;
