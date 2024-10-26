import './App.css';
import React, {useState, useEffect, useRef}  from 'react';
import useLocalStorage from "./useLocalStorage.js";

// const bookmarkArr = [
//     {key:1, name:"Google", href:"https://www.google.ru/"},
//     {key:2, name:"Youtube", href:"https://www.youtube.com/"},
//     {key:3 , name:"Yandex", href:"https://ya.ru/"}
// ]

function App() {
    const [modalWindowFlag, setModalWindowFlag] = useState(false);
    const [bookmarkArr, setBookmarkArr] = useLocalStorage("bookmarks",  []);
    const [counterKey, setCounterKey] = useState(()=>{
        return bookmarkArr.length > 0 ?  Math.max(...bookmarkArr.map(item => item.key)) + 1 : 0;
    });

    function handleClick(){
        setModalWindowFlag(true);
    }

    return (
        <div className="App">
            <Clock />
            <ModalWindow 
                counterKey={counterKey}
                setCounterKey={setCounterKey}
                flag={modalWindowFlag}
                bookmarks={bookmarkArr}
                setBookmarkArr={setBookmarkArr}
                cb={()=>{
                    setModalWindowFlag(false)
                }}
            />
            <header className="App-header">
                <div className="Page-container">
                    <Bookmarks 
                        bookmarks={bookmarkArr}
                        setBookmarkArr={setBookmarkArr}
                    />
                    <CreateBlock 
                        cb={handleClick}
                    />
                </div>
            </header>
        </div>
  );
}

function Bookmarks(props){

    function handleClick(key){
        props.setBookmarkArr(props.bookmarks.filter(a => a.key !== key))
    }

    function getListBookmark () {
        return props.bookmarks.map(bookmark => 
            <a className="Link-bookmark" key={bookmark.key} target="_blank" rel="noreferrer" href={bookmark.href}>
                <span 
                    onClick={(e)=>{
                        e.preventDefault()
                        handleClick(bookmark.key)
                    }}
                    className="Delete-bookmark">X</span>
                <div className="Inscription-bookmark">
                    <img src="img.png" alt="logo"></img>
                    <span className='Bookmarks-Name'>{bookmark.name}</span>
                </div>
            </a>
        );
    } 

    const list = getListBookmark();
    return(
       <>
        {list}
       </>
    )
}

function CreateBlock(props){

    return(
        <div 
            onClick={props.cb}
            className="Inscription-bookmark Create-block">
                <span className='Bookmarks-Name'>Создать</span>
        </div>
    )
}

function ModalWindow(props){
    const [link, setLink] = useState("");
    const [nameLink, setNameLink] = useState("");
    const inputLinkRef = useRef(null);
    const inputNameRef = useRef(null);
    
    function getDomainFromUrl(url) {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.hostname;
        } catch (_) {
            return false;
        }
        
    }

    function handleClick(){
        if(link.length){
            let name = nameLink;
            if(!nameLink.length)
            {
                let domain = getDomainFromUrl(link);
                inputNameRef.current.value = domain === false? link : domain;
                name = inputNameRef.current.value;
            }

            props.setCounterKey(props.counterKey + 1)
            props.setBookmarkArr(
            [
                ...props.bookmarks,
                {key:props.counterKey, name: name, href: link}
            ]);

            inputNameRef.current.value = "";
            inputLinkRef.current.value = "";
            setLink("");
            setNameLink("");
        }
    }
    function getInputValueLink(e){
        setLink(e.target.value)   
    }
    function getInputValueNameLink(e){
        setNameLink(e.target.value);
    }
    return(
        <div onClick={()=>{
            setLink("");
            setNameLink("");
            inputNameRef.current.value = "";
            inputLinkRef.current.value = "";
            props.cb();
        }}
            className={props.flag ? "ModalBackground" : "ModalBackground disable"}>
            <div className="ModalContainer" 
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                    <span>Добавить Закладку</span>
                <div className='ModalFlex'>
                    <span>Ссылка на страницу:</span>
                    <input 
                        ref={inputLinkRef}
                        onChange={getInputValueLink}
                        className='InputModal'
                        type="text"
                        placeholder="https://google.com/"></input>
                </div>
                <div className='ModalFlex'>
                    <span>
                        Название(не обязательно):
                    </span>
                    <input 
                        ref={inputNameRef}
                        onChange={getInputValueNameLink}
                        className='InputModal' type="text" placeholder="Google"></input>
                </div>
                    <button onClick={() => {
                        handleClick();
                        props.cb();
                    }
                    } className='ButtonModal'>Добавить</button>
            </div>
        </div>
    )
}

function Clock (){
    const [time, setTime] = useState(new Date())
    useEffect(()=>{
        const interval = 
        setInterval(() => {
            setTime(new Date())          
        }, 1000);
        return(()=> clearInterval(interval))
    }, [])

    const hours = time.getHours() > 9? time.getHours(): "0"+ time.getHours();
    const minutes = time.getMinutes() > 9 ? time.getMinutes(): "0"+time.getMinutes();
    const seconds = time.getSeconds() > 9 ? time.getSeconds(): "0"+time.getSeconds();
    const timeString = `${hours}:${minutes}:${seconds}`;

    return(
        <div className="ClockDiv">
            <p>{timeString}</p>
        </div>
    )
}
export default App;
