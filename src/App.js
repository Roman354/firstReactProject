import './App.css';
import React, {useState, useEffect}  from 'react';

const bookmarkArr = [
    {key:1, name:"Google", href:"https://www.google.ru/"},
    {key:2, name:"Youtube", href:"https://www.youtube.com/"},
    {key:3 , name:"Yandex", href:"https://ya.ru/"}
]





function App() {
    const[modalWindowFlag, setModalWindowFlag] = useState(false);

    function handlerClick(){
        setModalWindowFlag(true);
        // console.log(modalWindowFlag)
    }

    return (
        <div className="App">
            <Clock />
            <ModalWindow 
                flag={modalWindowFlag}
                cb={()=>{
                    setModalWindowFlag(false)
                }}
            />
            <header className="App-header">
                <div className="Page-container">
                    {/* <Bookmark name="Google" href="https://www.google.ru/" />
                    <Bookmark name="Youtube" href="https://www.youtube.com/" />
                    <Bookmark name="Yandex" href="https://ya.ru/" /> */}
                    {/* {listBookmark} */}
                    <Bookmarks 
                        bookmarks={bookmarkArr}
                    />
                    <CreateBlock 
                        cb={handlerClick}
                    />
                    
                </div>
           
            </header>
        </div>
  );
}
function Bookmarks({bookmarks}){
    
    function getListBookmark () {
        return bookmarks.map(bookmark => 
            <a className="Link-bookmark" key={bookmark.key} target="_blank" rel="noreferrer" href={bookmark.href}>
                <div className="Inscription-bookmark">
                    <span className='Bookmarks-Name'>{bookmark.name}</span>
                </div>
            </a>
        );
    } 
    // const[list, setList] = useState(getListBookmark);
   
    // useEffect(()=>{
    //     setList(
    //         getListBookmark
    //     )
    // }, [bookmarks])
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

    function handlerClick(){
        let key = bookmarkArr.length + 1;
        bookmarkArr.push({key:key, name: nameLink, href: link})
        setLink("");
        setNameLink("");
    }

    function getInputValueLink(e){
        setLink(e.target.value)
        console.log("link", link)
       
       
    }
    function getInputValueNameLink(e){
        setNameLink(e.target.value);
        console.log("nameLink", nameLink);
    }
    
    return(
        <div onClick={props.cb}
            className={props.flag ? "ModalBackground" : "ModalBackground disable"}>
            <div className="ModalContainer" 
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                    <span>Добавить Закладку</span>
                <div className='ModalFlex'>
                    <span>Ссылка на страницу:</span>
                    <input onChange={getInputValueLink}
                    className='InputModal'
                    type="text"
                    placeholder="https://google.com/"></input>
                </div>
                <div className='ModalFlex'>
                    <span>
                        Название(не обязательно):
                    </span>
                    <input 
                        onChange={getInputValueNameLink}
                    className='InputModal' type="text" placeholder="Google"></input>
                </div>
                    <button onClick={() => {
                        handlerClick();
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
