"use client";

import React from "react";
import { useParams } from "next/navigation";
import ItemEdit from "../../component/ItemEdit";

const EditItemPage = () => {
    const params = useParams();
    const itemId = params?.itemId;

    if (!itemId) return <p>Error: 아이템 ID {itemId}가 존재하지 않습니다.</p>;

    return <ItemEdit itemId={itemId} />;
};

export default EditItemPage;
