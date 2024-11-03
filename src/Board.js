import React, { useState,useRef}  from 'react';
import useLocalStorage from "./useLocalStorage.js";

export default function Board(props){
    const boardHandle = useRef(null);
    const boardSwitch = useRef(null);
    const [arrNotes, setArrNotes] = useLocalStorage("listNotes", [])
    const [counterKey, setCounterKey] = useState(()=>{
        return arrNotes.length > 0 ?  Math.max(...arrNotes.map(item => item.key)) + 1 : 0;
    });
   
    const inputChangeBackground = useRef(null);

    function pullsOutTheBoard(){
        boardHandle.current.classList.toggle("visible");
        boardSwitch.current.classList.toggle("visible");
        // setArrNotes([
        //     {text:"Текст первой записки", position:{x:0,y:0},key:1},
        //     {text:"Я крутой", position:{x:100,y:100},key:2}
        
        // ])
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

    function getListNotes () {

        return arrNotes.map(note => 
            <Note 
                arrNotes={arrNotes}
                setArrNotes={setArrNotes}
                refBoard={boardHandle}
               
                id={note.key}
                key={note.key}
            />
        )
    }
  
    return(
        <div ref={boardHandle} className="Board-container">
            <div ref={boardSwitch} onClick={pullsOutTheBoard} className='Board-handle'></div>
            <div className='Board-content'>
                <input ref={inputChangeBackground}></input>
                <button
                    className='Button-change-background' 
                    onClick={()=>{
                        changeBackground(inputChangeBackground.current.value)
                    }}>
                        Применить
                </button>
                <CreateNote 
                    counterKey={counterKey}
                    setCounterKey={setCounterKey}
                    arrNotes={arrNotes}
                    setArrNotes={setArrNotes}
                />
                {getListNotes()}
            </div>
          
        </div>
    )
    
}

function Note(props) {
    const noteInf = props.arrNotes.filter(a => a.key === props.id)[0];
    const textRef = useRef(noteInf.text);
    const [position, setPosition] = useState({ x: noteInf.position.x, y: noteInf.position.y });
 
    let dragStartOffset = { x: 0, y: 0 };
    const noteRef = useRef(null); 
    const textNoteRef = useRef(null); 
    // let timeout;

    function handleTextChange () {
    
        textRef.current = textNoteRef.current.innerText;
        // clearTimeout(timeout);
        // timeout = setTimeout(function() {
        props.setArrNotes(prevArr => 
            prevArr.map(item => 
                item.key === noteInf.key ? { ...item, text: textNoteRef.current.innerText } : item
            )
        );
        // }, 2000); 
    };

    function handleMouseDown (e){
        const noteRect = noteRef.current.getBoundingClientRect();
        dragStartOffset = {
            x: e.clientX - noteRect.left,
            y: e.clientY - noteRect.top,
        };
    
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
  
    function handleMouseMove(e){
        const container = props.refBoard.current;
        if (container) {
            const containerRect = container.getBoundingClientRect();
            const newX = e.clientX - containerRect.x - dragStartOffset.x;
            const newY = e.clientY - containerRect.y - dragStartOffset.y;

            const clampedX = Math.max(40, Math.min(newX, containerRect.width - 220)); 
            const clampedY = Math.max(0, Math.min(newY, containerRect.height - 140)); 

            noteRef.current.style.left = `${clampedX}px`;
            noteRef.current.style.top = `${clampedY}px`;
        }
    };
  
    function handleMouseUp() {
        const noteRect = noteRef.current.getBoundingClientRect();
        const containerRect = props.refBoard.current.getBoundingClientRect();

        setPosition({
            x: noteRect.left - containerRect.left,
            y: noteRect.top - containerRect.top,
        });

        props.setArrNotes(prevArr => 
            prevArr.map(item => 
                item.key === noteInf.key ? { ...item, position:{x: noteRect.left - containerRect.left, y:noteRect.top - containerRect.top} } : item
            )
        );
       
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  
    function deleteNote(){
        props.setArrNotes(props.arrNotes.filter(a => a.key !== noteInf.key))
        // if(props.bookmarks.length === 1)
        // {
        //     props.setCounterKey(0);
        // }
    }
    function changeNote(){
        if(textNoteRef.current.contentEditable === "true")
        {
            textNoteRef.current.classList.remove("change")
            
            handleTextChange();
            textNoteRef.current.contentEditable = "false";
        }
        else{
            textNoteRef.current.contentEditable = "true";
            textNoteRef.current.classList.add("change")
        }
    
    }
    return (
        <div 
            key={noteInf.key}  
            ref={noteRef}
            style={{
                position: 'absolute',
                top: `${position.y}px`,
                left: `${position.x}px`,
            }}>
         
            <div className="note-mover"onMouseDown={handleMouseDown}>
                <button className="change-note-button"onClick={changeNote}>✏️</button>
                <button className="delete-note-button"onClick={deleteNote}>✕</button>
            </div>
            <div
                ref={textNoteRef}
                className="note"
                contentEditable="false"
                suppressContentEditableWarning={true}
                // onInput={handleTextChange}
                >
                {textRef.current}
            </div>
        </div>
    );
};

function CreateNote(props)
{
    // counterKey={counterKey}
    // setCounterKey={setCounterKey}
    function createNewNote(){
        // props.setCounterKey(props.counterKey + 1)
        props.setArrNotes(
        [
            ...props.arrNotes,
            {"text":"","position":{"x":1508,"y":0}, "key": props.counterKey}
        ]);
        props.setCounterKey(props.counterKey + 1)
    }
    return(
        <button 
            onClick={createNewNote}
            className='create-note-button'>
            +
        </button>
    )
}