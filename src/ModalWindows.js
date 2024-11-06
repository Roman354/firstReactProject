import React, {useState, useEffect , useRef}  from 'react';
import imgNotFound from '../src/imageNotFound.png';

export function CreateModalWindow(props){
    const [link, setLink] = useState("");
    const [nameLink, setNameLink] = useState("");
    const inputLinkRef = useRef(null);
    const inputNameRef = useRef(null);
    const inputLoadImg = useRef(null);
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

    function handleClickCreate(){
        if(link.length){
            let name = nameLink;
            if(!nameLink.length)
            {
                let domain = getDomainFromUrl(link);
                inputNameRef.current.value = domain === false? link : domain;
                name = inputNameRef.current.value;
            }

            console.log(inputLoadImg.current.value)
            if(inputLoadImg.current.value === ""){

 

                getImg(name).then(imageUrl => {
                    getNewBookmarks(props.counterKey, name, link, imageUrl);
                }).catch(error => {
                    getNewBookmarks(props.counterKey, name, link, imgNotFound);
                    console.error('Не удалось получить изображение:', error);
                   
                });
            }else
            {
                const file = inputLoadImg.current.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        getNewBookmarks(props.counterKey, name, link, reader.result);
                    
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert("Пожалуйста, выберите файл изображения.");
                }
                inputLoadImg.current.value = "";
        
               
            }
            

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
        <div
            className={props.flag ? "modal-background" : "modal-background disable"} 
            onMouseDown={ () => {
                setLink("");
                setNameLink("");
                inputNameRef.current.value = "";
                inputLinkRef.current.value = "";
                props.cb();
            }}
        >
            <div className="modal-container" 
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <span>Добавить Закладку</span>
                <div className='modal-flex'>
                    <span>Ссылка на страницу:</span>
                    <input 
                        ref={inputLinkRef}
                        onChange={getInputValueLink}
                        className='input-modal'
                        type="text"
                        placeholder="https://google.com/">
                    </input>
                </div>
                <div className='modal-flex'>
                    <span>
                        Название(не обязательно):
                    </span>
                    <input 
                        ref={inputNameRef}
                        onChange={getInputValueNameLink}
                        className='input-modal' type="text" placeholder="Google">
                    </input>
                </div>
                <p>Добавить фон:</p>
                <input className='input-load-img' ref={inputLoadImg} type='file' name='file' accept='image/*'></input>
                <button  
                    className='button-modal'
                    onClick={() => {
                            handleClickCreate();
                            props.cb();
                    }}
                >Добавить</button>
 
            </div>
        </div>
    )
}
export function ChangeModalWindow(props){

    const element = props.bookmarks.find(a => a.key === props.bookmarkKey);
    const [link, setLink] = useState(element? element.href : "");
    const [nameLink, setNameLink] = useState(element? element.name : "");
    const inputLoadImg = useRef(null);
    useEffect(()=>{
        if(element)
        {
            setLink(element.href)
            setNameLink(element.name)
           
        }
      
    }, [props.bookmarkKey, element])

    const inputLinkRef = useRef(null);
    const inputNameRef = useRef(null);

    function handleClickChange(key){

        const file = inputLoadImg.current.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                props.setBookmarkArr(prevArr => 
                    prevArr.map(item => 
                        item.key === key ? { ...item, ...{name: nameLink, href: link, img:reader.result} } : item
                    )
                );

            };
            reader.readAsDataURL(file);
        } else {
            props.setBookmarkArr(prevArr => 
                prevArr.map(item => 
                    item.key === key ? { ...item, ...{name: nameLink, href: link} } : item
                )
              );
        }
        
       
        props.cb();
    }

    function getInputValueLink(e){
        setLink(e.target.value)   
    }
    
    function getInputValueNameLink(e){
        setNameLink(e.target.value);
    }
    return(
        <div onMouseDown={()=>{
            props.cb();
        }}
            className={props.flag ? "modal-background" : "modal-background disable"}>
            <div className="modal-container" 
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}>
                <span>Изменить Закладку</span>
                <div className='modal-flex'>
                    <span>Ссылка на страницу:</span>
                    <input 
                        value={link}
                        ref={inputLinkRef}
                        onChange={getInputValueLink}
                        className='input-modal'
                        type="text"
                        placeholder="https://google.com/"></input>
                </div>
                <div className='modal-flex'>
                    <span>
                        Название(не обязательно):
                    </span>
                    <input 
                        value={nameLink}
                        ref={inputNameRef}
                        onChange={getInputValueNameLink}
                        className='input-modal' type="text" placeholder="Google"></input>
                </div> 
                <p>Добавить фон:</p>
                <input className='input-load-img' ref={inputLoadImg} type='file' name='file' accept='image/*'></input>
                <button onClick={() => {
                    handleClickChange(props.bookmarkKey);
                    
                }
                } className='button-modal'>Изменить</button>
                  
            </div>
        </div>
    )
}

export function QuestionModalWindow(){
    const[modalFlag, setModalFlag] = useState(false);
    const gifQuestion = useRef(null);
    const answerQuestion = useRef(null);
    function getAnswer(){
        fetch('https://yesno.wtf/api')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            return response.json(); 
        })
        .then(data => {
            console.log(data);
            console.log(gifQuestion.current.className);
            gifQuestion.current.classList.remove("disable");
            gifQuestion.current.src = data.image;
            answerQuestion.current.textContent = data.answer === "yes"? "Да" : "Нет";
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
    return(
        <>
            <div onClick={()=>{setModalFlag(true)}} className="button-question"></div>
            <div className={modalFlag ? 'modal-background' : 'disable'} onMouseDown={()=>{
                gifQuestion.current.classList.add("disable");
                answerQuestion.current.textContent ="";
                setModalFlag(false)
            }}>
            <div className='modal-question' onMouseDown={(e)=>{e.stopPropagation();}}>
                <h3>Получить ответ на вопрос(ДА или НЕТ)</h3>
               
             
                <p className='question-answer-p' ref={answerQuestion}></p>
                <img className='disable' ref={gifQuestion} alt="gif answer"></img>
                <button onClick={getAnswer} className='button-question-background'>  
                    Применить
                </button>
            </div> 
            </div>
        </>
    )
}