import React, {useState, useEffect , useRef}  from 'react';
import imgNotFound from '../src/imageNotFound.png';

export function CreateModalWindow(props){
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

    function handleClickCreate(){
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
        <div onMouseDown={()=>{
            setLink("");
            setNameLink("");
            inputNameRef.current.value = "";
            inputLinkRef.current.value = "";
            props.cb();
        }}
            className={props.flag ? "ModalBackground" : "ModalBackground disable"}>
            <div className="ModalContainer" 
                onMouseDown={(e) => {
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
                        handleClickCreate();
                        props.cb();
                    }
                    } className='ButtonModal'>Добавить</button>
            </div>
        </div>
    )
}
export function ChangeModalWindow(props){

    const element = props.bookmarks.find(a => a.key === props.bookmarkKey);
    const [link, setLink] = useState(element? element.href : "");
    const [nameLink, setNameLink] = useState(element? element.name : "");

    useEffect(()=>{
        if(element)
        {
            setLink(element.href)
            setNameLink(element.name)
        }
      
    }, [props.bookmarkKey, element])

    const inputLinkRef = useRef(null);
    const inputNameRef = useRef(null);

    function handleClickChange(key, updatedFields){
        props.setBookmarkArr(prevArr => 
            prevArr.map(item => 
                item.key === key ? { ...item, ...updatedFields } : item
            )
          );
       
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
            className={props.flag ? "ModalBackground" : "ModalBackground disable"}>
            <div className="ModalContainer" 
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}>
                <span>Изменить Закладку</span>
                <div className='ModalFlex'>
                    <span>Ссылка на страницу:</span>
                    <input 
                        value={link}
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
                        value={nameLink}
                        ref={inputNameRef}
                        onChange={getInputValueNameLink}
                        className='InputModal' type="text" placeholder="Google"></input>
                </div>
                    <button onClick={() => {
                        handleClickChange(props.bookmarkKey, {name: nameLink, href: link});
                      
                    }
                    } className='ButtonModal'>Изменить</button>
            </div>
        </div>
    )
}
