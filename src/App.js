import './App.css';
import React, {useState, useEffect}  from 'react';






function App() {
    const[modalWindowFlag, setModalWindowFlag] = useState(false);

    console.log(modalWindowFlag);

    function handlerClick(){
        setModalWindowFlag(true)
        console.log(modalWindowFlag)
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
                    <div className="Page-bookmark"><span className='Bookmarks-Name'>Google</span></div>
                    <div className="Page-bookmark"><span className='Bookmarks-Name'></span></div>
                    <div className="Page-bookmark"><span className='Bookmarks-Name'></span></div>
                    <div className="Page-bookmark"><span className='Bookmarks-Name'></span></div>
                    <div className="Page-bookmark"><span className='Bookmarks-Name'></span></div>
                    <div className="Page-bookmark"><span className='Bookmarks-Name'>Ds</span></div>
                    <div className="Page-bookmark"><span className='Bookmarks-Name'>yandex</span></div>
                    <div 
                        onClick={handlerClick}
                    className="Page-bookmark"><span className='Bookmarks-Name'>Создать</span></div>
                    
                </div>
           
            </header>
        </div>
  );
}

function ModalWindow(props){
    // const [flagRender, setRenderFlag] = useState(props.flag);
    


    function handlerClick(){
        props.cb();
        // setRenderFlag(false);
        // console.log(flagRender);
        // e.stopPropagation();
    }


    return(
        <div className={ props.flag ? "ModalContainer" : "ModalContainer disable"}>
                <span>Добавить Закладку</span>
            <div className='ModalFlex'>
                <span>Ссылка на страницу:</span>
                <input className='InputModal' type="text" placeholder="https://google.com/"></input>
            </div>
            <div className='ModalFlex'>
                <span>
                    Название(не обязательно):
                </span>
                <input className='InputModal' type="text" placeholder="Google"></input>
            </div>
                <button onClick={handlerClick} className='ButtonModal'>Добавить</button>
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
