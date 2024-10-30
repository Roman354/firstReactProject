import React, { useRef}  from 'react';

export default function Board(props){
    const boardHandle = useRef(null);
    const boardSwitch = useRef(null);

    const inputChangeBackground = useRef(null);

    function pullsOutTheBoard(){
        boardHandle.current.classList.toggle("visible");
        boardSwitch.current.classList.toggle("visible") 
    }

    async function changeBackground(query){
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
        <div ref={boardHandle} className="Board-container">
            <div  ref={boardSwitch} onClick={pullsOutTheBoard} className='Board-handle'></div>
            <div className='Board-content'>
                <input ref={inputChangeBackground}></input>
                <button
                    className='Button-change-background' 
                    onClick={()=>{
                        changeBackground(inputChangeBackground.current.value)
                    }}>
                        Применить
                    </button>
            </div>
        </div>
    )
    
}