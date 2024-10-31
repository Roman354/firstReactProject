import React, { useState,useRef}  from 'react';

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
            <Note />
        </div>
    )
    
}

const Note = () => {
    const textRef = useRef("Кликните здесь, чтобы изменить текст записки");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const noteRef = useRef(null); 

    const handleTextChange = () => {
        textRef.current = noteRef.current.innerText;
    };
  
    const handleMouseDown = (e) => {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
  
    const handleMouseMove = (e) => {
      if (!isDragging) return;
  
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
  
        // Проверяем границы, чтобы ограничить элемент внутри контейнера
        const clampedX = Math.max(0, Math.min(newX, containerRect.width - 220)); // 200 — ширина Note
        const clampedY = Math.max(0, Math.min(newY, containerRect.height - 140)); // 100 — высота Note
  
        noteRef.current.style.left = `${clampedX}px`;
        noteRef.current.style.top = `${clampedY}px`;
      }
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
      const noteRect = noteRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: noteRect.left - containerRect.left,
        y: noteRect.top - containerRect.top,
      });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  
    return (
      <div className="container-note" ref={containerRef}>
        <div   
            ref={noteRef}
            style={{
                position: 'absolute',
                top: `${position.y}px`,
                left: `${position.x}px`,
            }}
            >
            <div 
                className="note-mover"
               
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            ></div>
            <div
                className="note"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={handleTextChange}
               
          
            >
                {textRef.current}
            </div>
            </div>
      </div>
    );
  };
