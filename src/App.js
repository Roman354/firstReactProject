import './App.css';
import React, {useState, useEffect, useRef}  from 'react';
import useLocalStorage from "./useLocalStorage.js";
import imgNotFound from '../src/imageNotFound.png';
// const bookmarkArr = [
//     {key:1, name:"Google", href:"https://www.google.ru/"},
//     {key:2, name:"Youtube", href:"https://www.youtube.com/"},
//     {key:3 , name:"Yandex", href:"https://ya.ru/"}
// ]

function App() {
    const [CreateModalWindowFlag, setCreateModalWindowFlag] = useState(false);
    const [bookmarkArr, setBookmarkArr] = useLocalStorage("bookmarks",  []);
    const [counterKey, setCounterKey] = useState(()=>{
        return bookmarkArr.length > 0 ?  Math.max(...bookmarkArr.map(item => item.key)) + 1 : 0;
    });

    function handleClick(){
        setCreateModalWindowFlag(true);
    }

    return (
        <div className="App">
            <Clock />
            <CreateModalWindow 
                counterKey={counterKey}
                setCounterKey={setCounterKey}
                flag={CreateModalWindowFlag}
                bookmarks={bookmarkArr}
                setBookmarkArr={setBookmarkArr}
                cb={()=>{
                    setCreateModalWindowFlag(false)
                }}
            />
            <header className="App-header">
                <div className="Page-container">
                    <Bookmarks 
                        bookmarks={bookmarkArr}
                        setBookmarkArr={setBookmarkArr}
                        setCounterKey={setCounterKey}
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
        if(props.bookmarks.length === 1)
        {
            props.setCounterKey(0);
        }
    }

    function getListBookmark () {
        return props.bookmarks.map(bookmark => 
            <a className="Link-bookmark" key={bookmark.key} target="_blank" rel="noreferrer" href={bookmark.href}>
                <div>
                    <span 
                        onClick={(e)=>{
                            e.preventDefault()
                            handleClick(bookmark.key)
                        }}
                        className="Delete-bookmark">✕</span>
                </div>
                <div className="Inscription-bookmark">
                    <img className="Img-bookmark" src={bookmark.img} alt={bookmark.name}></img>
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

function CreateModalWindow(props){
    const [link, setLink] = useState("");
    const [nameLink, setNameLink] = useState("");
    const inputLinkRef = useRef(null);
    const inputNameRef = useRef(null);
    
    function getDomainFromUrl(url) {
        try {
            const hostname  = new URL(url).hostname;
            const siteName = hostname.replace(/^www\./, '').split('.')[0];
            return siteName;
        } catch (_) {
            return false;
        }
        
    }
    async function getImg(requestWord){
        const accessKey = 'bfs3AZiy96Dr00cW3P_XOhufG55FZDGkrLeyWev6VKY'; 
        const url = `https://api.unsplash.com/search/photos?query=${requestWord}&client_id=${accessKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
        
            if (data.results.length > 0) {
              const imageUrl = `${data.results[0].urls.raw}&w=200&h=78&fit=crop`;
              return imageUrl; 
            } else {
              throw new Error('Изображения не найдены');
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения с Unsplash:', error);
            throw error;
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
     
            getImg(name).then(imageUrl => {
                getNewBookmarks(props.counterKey, name, link, imageUrl);
            }).catch(error => {
                getNewBookmarks(props.counterKey, name, link, imgNotFound);
                console.error('Не удалось получить изображение:', error);
               
            });

        }
    }

    function getNewBookmarks(key, name, href, img){
        props.setCounterKey(props.counterKey + 1)
        props.setBookmarkArr(
        [
            ...props.bookmarks,
            {key:key, name: name, href: href, img: img}
        ]);
        inputNameRef.current.value = "";
        inputLinkRef.current.value = "";
        setLink("");
        setNameLink("");
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

function ChangeModalWindow(props){
    const [link, setLink] = useState("");
    const [nameLink, setNameLink] = useState("");
    const inputLinkRef = useRef(null);
    const inputNameRef = useRef(null);
    
    function handleClick(){
        // if(link.length){
            // let name = nameLink;
            // if(!nameLink.length)
            // {
            //     let domain = getDomainFromUrl(link);
            //     inputNameRef.current.value = domain === false? link : domain;
            //     name = inputNameRef.current.value;
            // }
     
            // getImg(name).then(imageUrl => {
            //     // getNewBookmarks(props.counterKey, name, link, imageUrl);
            // }).catch(error => {
            //     // getNewBookmarks(props.counterKey, name, link, imgNotFound);
            //     console.error('Не удалось получить изображение:', error);
               
            // });

        // }
    }

    function getInputValueLink(e){
        setLink(e.target.value)   
    }
    function getInputValueNameLink(e){
        setNameLink(e.target.value);
    }
    return(
        <div onClick={()=>{
            props.cb();
        }}
            className={props.flag ? "ModalBackground" : "ModalBackground disable"}>
            <div className="ModalContainer" 
                onClick={(e) => {
                    e.stopPropagation();
                }}>
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
