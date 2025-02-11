import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Searchform() {
    const router = useRouter();
    const { handleSubmit } = useForm();
    
    function randomSearchPlaceholder() {
        let rand = Math.floor(Math.random() * 3) + 1;
        let str ="";
        if (rand == 1) {
            return "오늘 끌리는 팝업은?";
        }
        else if (rand == 2) {
            return "지금 바로 팝업 검색!";
        }
        else {
            return "당신만을 위한 팝업, 팝피플";
        }
    }
    
    const searchBtnClick = () => {

    };

    const searchResult = () => {
        let keyword = document.getElementsByName("keyword");
        console.log(keyword);
    };

    const onSubmit = () => {
        
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" name="keyword" className="searchSpace" onChange={searchResult} placeholder={randomSearchPlaceholder()}></input>
            <button type="submit" className="searchBtn">
                <FontAwesomeIcon icon={faMagnifyingGlass} fontSize="100%"/>
            </button>
        </form>
    )
}