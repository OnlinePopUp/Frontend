'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./popup.css";
// import ucl from "/public/ucl.jpg";

export default function Popuplist() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTag, setActiveTag] = useState("date");
    const [isMouseOn, setMouseOn] = useState({});
    const router = useRouter();

    const handleMouseEnter = (id: number) => setMouseOn({[id]: true});
    const handleMouseLeave = (id: number) => setMouseOn({[id]: false});
    const handlePopupClick = (id: number) => router.push(`/popup/${id}`);

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/posts")
        .then(response => {
            setData(response.data);
            setLoading(false);
            console.log(response.data);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p><FontAwesomeIcon icon={faSpinner} width="30"/></p>
    }
    if (error) {
        return <p>Error: {error}</p>
    }

    const handleClick = (tag: string) => {
        setActiveTag(tag); // 활성화된 태그 업데이트
    };

    return (
        <div className="popupList">
            <div className="sortPopup">
                <Link href="/popup/?sorter=date"
                    className={activeTag === "date" ? "sortTagClicked" : "sortTagUnclicked"}
                    onClick={() => handleClick("date")}
                >최신순</Link>
                <h4 className="sortTag">&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                <Link href="/popup/?sorter=expiration"
                    className={activeTag === "expiration" ? "sortTagClicked" : "sortTagUnclicked"}
                    onClick={() => handleClick("expiration")}
                >마감순</Link>
                <h4 className="sortTag">&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                <Link href="/popup/?sorter=name"
                    className={activeTag === "name" ? "sortTagClicked" : "sortTagUnclicked"}
                    onClick={() => handleClick("name")}
                >이름순</Link>
            </div>
            <div className="popUps">
                <div className="grid content-center lg:grid-cols-3 gap-10">
                    {data.map(post => (
                        <div className="singlePopup">
                            <div key={post.id} className={`${isMouseOn[post.id] ? "mouseOnCard" : "mouseOffCard"}`}
                                onMouseEnter={() => handleMouseEnter(post.id)}
                                onMouseLeave={() => handleMouseLeave(post.id)}
                                onClick={() => handlePopupClick(post.id)}
                            >
                                <div className="relative overflow-hidden min-h-[403px] w-20%">
                                    <div className="popupItem">
                                        <Image className="cardImage" src="/ucl.jpg"  alt={post.userId} />
                                        <p className="mt-3 ml-3 text-4xl truncate">{post.title}</p>
                                        <h2 className="mt-1 ml-3 text-lg truncate">{post.title}</h2>
                                        <h4 className="mt-1 ml-3 text-2xl line-clamp-2">{post.body}</h4>
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