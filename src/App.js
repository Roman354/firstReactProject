import './App.css';
import React, {useState, useEffect }  from 'react';
import useLocalStorage from "./useLocalStorage.js";
import defaultBackground from '../src/background.jpeg'
import {ChangeModalWindow, CreateModalWindow} from '../src/ModalWindows.js';
import Board from '../src/Board.js';

function App() {
    const [createModalWindowFlag, setCreateModalWindowFlag] = useState(false);
    const [changeModalWindowFlag, setChangeModalWindowFlag] = useState(false);
    const [changeBookmark, setChangeBookmark] = useState(null);
    const [bookmarkArr, setBookmarkArr] = useLocalStorage("bookmarks",  []);

    const [backgroundImage, setBackgroundImage] = useLocalStorage("boardImg",  defaultBackground);
    const [counterKey, setCounterKey] = useState(()=>{
        return bookmarkArr.length > 0 ?  Math.max(...bookmarkArr.map(item => item.key)) + 1 : 0;
    });

    async function handleClickFlag(){
        setCreateModalWindowFlag(true);
    }

    return (
        <div className="App">
        <header>
            <Clock />
        </header>
        <main className="main-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <CreateModalWindow 
                counterKey={counterKey}
                setCounterKey={setCounterKey}
                flag={createModalWindowFlag}
                bookmarks={bookmarkArr}
                setBookmarkArr={setBookmarkArr}
                cb={()=>{
                    setCreateModalWindowFlag(false)
                }}
            />
            <ChangeModalWindow 
                flag={changeModalWindowFlag}
                cb={()=>{
                    setChangeModalWindowFlag(false)
                }}
                bookmarks={bookmarkArr}
                setBookmarkArr={setBookmarkArr}
                bookmarkKey={changeBookmark}
            />
          
                <div className="page-container">
                    <Bookmarks 
                        bookmarks={bookmarkArr}
                        setBookmarkArr={setBookmarkArr}
                        setCounterKey={setCounterKey}
                        setChangeBookmark={setChangeBookmark}
                        cb={()=>{
                            setChangeModalWindowFlag(true)
                        }}
                    />
                    <CreateBlock 
                        cb={handleClickFlag}
                    />
                </div>
                <Board 
                    setBackgroundImage={setBackgroundImage}
                />
            </main>
        </div>
  );
}

function Bookmarks(props){
    const [deleteModalFlag, setDeleteModalFlag] = useState(false);
    const [key, setKey] = useState(null);

    const deleteModal = 
    <div className='modal-background'>
        <div className='delete-modal'>
            <h2>Вы точно хотите удалить эту вкладку?</h2>
            <div className='buttons-container'>
                <button onClick={()=>{
                    handleClickDelete(key)
                    setDeleteModalFlag(false)
                    }} className="delete-button">Удалить</button>
                <button onClick={()=>{setDeleteModalFlag(false)}} className="cancel-button">Отмена</button>
            </div>
        </div>
    </div>
    

    function handleClickDelete(key){
        props.setBookmarkArr(props.bookmarks.filter(a => a.key !== key))
        if(props.bookmarks.length === 1)
        {
            props.setCounterKey(0);
        }
    }
   
    function getListBookmark () {
        return props.bookmarks.map(bookmark => 
            <a className="link-bookmark" key={bookmark.key} target="_blank" rel="noreferrer" href={bookmark.href}>
                <div>
                    <span 
                        onClick={(e)=>{
                            e.preventDefault()
                            props.setChangeBookmark(bookmark.key)
                            props.cb()
                        }}
                        className="change-bookmark">✏️</span>
                </div>
                <div>
                    <span 
                        onClick={(e)=>{
                            e.preventDefault()
                            setDeleteModalFlag(true)
                            setKey(bookmark.key);
                            // 
                        }}
                        className="delete-bookmark">✕</span>
                </div>
                <div className="inscription-bookmark">
                    <img className="img-bookmark" src={bookmark.img} alt={bookmark.name}></img>
                    <span className='bookmarks-Name'>{bookmark.name}</span>
                </div>
            </a>
        );
    } 

    const list = getListBookmark();
    return(
        <>
        {list}
        {deleteModalFlag ? deleteModal : ""}
        </>
    )
}

function CreateBlock(props){
    return(
        <div 
            onClick={props.cb}
            className="inscription-bookmark create-block">
                <div className='plus-create'>+</div>
                <span className='bookmarks-Name'>Создать</span>
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
        <div className="clock-div">
            <p>{timeString}</p>
        </div>
    )
}
export default App;
