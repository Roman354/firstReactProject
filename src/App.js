import './App.css';
import React, {useState, useEffect, useRef }  from 'react';
import useLocalStorage from "./useLocalStorage.js";
import defaultBackground from '../src/background.jpeg'
import {ChangeModalWindow, CreateModalWindow} from '../src/ModalWindows.js';
import Board from '../src/Board.js';

function App() {
    const [createModalWindowFlag, setCreateModalWindowFlag] = useState(false);
    const [changeModalWindowFlag, setChangeModalWindowFlag] = useState(false);
    const [modalSetting, setModalSetting] = useState(false);
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
            <Settings
                flag={modalSetting}
                flagChange={setModalSetting}
                setBackgroundImage={setBackgroundImage}
            />
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

                />
            </main>
        </div>
  );
}

function Settings(props){
      
    const inputUnsplashBackground = useRef(null);
    const inputLocalImg = useRef(null);
    
 
    function handleClickCreate(cb){
        if(inputUnsplashBackground.current.value !== "")
        {
            changeBackground(inputUnsplashBackground.current.value);
            inputUnsplashBackground.current.value = "";
        }
        if(inputUnsplashBackground.current.value === "" && inputLocalImg.current.value !== ""){
            
            const file = inputLocalImg.current.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                inputUnsplashBackground.current.value = "";
                inputLocalImg.current.value = "";
                reader.onload = () => {
                    props.setBackgroundImage(reader.result);
                
                };
               
                reader.readAsDataURL(file);
            } else {
                alert("Пожалуйста, выберите файл изображения.");
            }
        }
        cb();
             
    }

    async function changeBackground(query)
    {
        const accessKey = 'bfs3AZiy96Dr00cW3P_XOhufG55FZDGkrLeyWev6VKY'; 
        const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
              const imageUrl = `${data.results[0].urls.raw}&w=${window.screen.width}&h=${window.screen.height}&fit=crop`;
              props.setBackgroundImage(imageUrl);
            } else {
              throw new Error('Изображения не найдены');
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения с Unsplash:', error);
            throw error;
        }
    }
   return(
        <>
            <button  onMouseDown={()=>{props.flagChange(true)}}
            className='setting-button'></button>
            <div className={props.flag ? 'modal-background' : 'disable'} onMouseDown={()=>{props.flagChange(false)}}>
                <div className='modal-container' onMouseDown={(e)=>{e.stopPropagation();}}>
                    <p>Введите текстовый запрос картинки:</p>
                    <input className='input-unsplash' ref={inputUnsplashBackground}></input>
                    <p>Или зарузите свою картинку:</p>
                    <input  className='input-load-img' ref={inputLocalImg} type='file' name='file' accept='image/*'></input>
                    <button
                        className='button-change-background' 
                        onClick={()=>{
                            handleClickCreate(()=>{props.flagChange(false)})
                           
                        }}>
                            Применить
                    </button>
                </div> 
            </div>
        </>
   ) 
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
