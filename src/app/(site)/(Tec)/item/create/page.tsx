"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ItemCreate from "../component/ItemCreate";

const ItemCreatePage = () => {
    const [placeholder, setPlaceholder] = useState("오늘 끌리는 팝업은?");
    
    useEffect(() => {
        setPlaceholder("당신만을 위한 팝업, 팝피플");
    }, []);

    return (
            <ItemCreate />
    );
};

export default ItemCreatePage;
