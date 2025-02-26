'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./../popup.css";
import noImage from '/public/noImage.png';

interface Popup {
    popId: number;
    title: string;
    email: string;
    content: string;
    start: string;
    exp: string;
    offline: string;
    address: string;
    category: string;
    image: string;
}

export default function Popuplist() {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTag, setActiveTag] = useState("date");
    const [isMouseOn, setMouseOn] = useState({});
    const router = useRouter();

    const handleMouseEnter = (id: number) => setMouseOn({[id]: true});
    const handleMouseLeave = (id: number) => setMouseOn({[id]: false});
    const handlePopupClick = (id: number) => router.push(`/popup/${id}`);

    const sortPopups = (popups: Popup[], sortType: string) => {
        return [...popups].sort((a, b) => {
            switch (sortType) {
                case 'date':
                    return new Date(b.start).getTime() - new Date(a.start).getTime();
                case 'expiration':
                    return new Date(a.exp).getTime() - new Date(b.exp).getTime();
                case 'name':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    };

    const fetchPopups = useCallback(() => {
        setLoading(true);
        axios.get(`http://47.130.76.132:8080/popup/all?category=전체&page=0&size=100`)
            .then(response => {
                const sortedPopups = sortPopups(response.data, activeTag);
                setPopups(sortedPopups);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [activeTag]);

    useEffect(() => {
        fetchPopups();
    }, [fetchPopups]);

    const handleClick = (tag) => {
        setActiveTag(tag);
        setPopups(prevPopups => sortPopups(prevPopups, tag));
    };

    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        setHeaderHeight(document.querySelector("header")?.clientHeight || 0);
    }, []);
    
    const [currentTime, setCurrentTime] = useState<number | null>(null);
    
    useEffect(() => {
        setCurrentTime(Date.now());
    }, []);

    return (
        <div className="popupList" style={{ height: 'calc(100vh - [헤더높이]px)', overflowY: 'auto' }}>
            <div className="sortPopup">
                <h4
                    className={activeTag === "date" ? "sortTagClicked" : "sortTagUnclicked"}
                    onClick={() => handleClick("date")}
                >최신순</h4>
                <h4 className="sortTag">&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                <h4
                    className={activeTag === "expiration" ? "sortTagClicked" : "sortTagUnclicked"}
                    onClick={() => handleClick("expiration")}
                >마감순</h4>
                <h4 className="sortTag">&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                <h4
                    className={activeTag === "name" ? "sortTagClicked" : "sortTagUnclicked"}
                    onClick={() => handleClick("name")}
                >이름순</h4>
            </div>
            <div className="popUps" style={{ minHeight: '100%' }}>
                <div className="grid content-center lg:grid-cols-3 gap-10 pt-5 pb-5">
                    {popups.map(popup => (
                        <div key={popup.popId} className="singlePopup">
                            <div className={`${isMouseOn[popup.popId] ? "mouseOnCard" : "mouseOffCard"}`}
                                onMouseEnter={() => handleMouseEnter(popup.popId)}
                                onMouseLeave={() => handleMouseLeave(popup.popId)}
                                onClick={() => handlePopupClick(popup.popId)}
                            >
                                <div className="relative overflow-hidden h-[100%] w-20%">
                                    <div className="popupItem">
                                        <div className="relative h-[200px] w-[100%]">
                                            <Image 
                                                className="rounded-lg" 
                                                src={popup.image || noImage}
                                                alt={popup.title || "Default Image"}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div className="sticky mb-3">
                                            <p className="mt-3 ml-3 text-4xl truncate">{popup.title}</p>
                                            <h2 className="mt-1 ml-3 text-lg truncate">{popup.email}</h2>
                                            <h4 className="mt-1 ml-3 text-2xl line-clamp-2">{popup.content}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}