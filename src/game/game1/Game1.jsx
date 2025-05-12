import styles from "./Game1.module.css";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie"
import { FaHeart } from "react-icons/fa";
import getWords from './Game1Utils';
import GameEnd from "./GameEnd";
import CountDown from "./CountDown";
import WelcomeMenu from "./WelcomeMenu";
import axios from "axios";

function Game1() {
    let wordsCount = 1;
    const speed = useRef(0.02);

    const diff = [0.03,0.04,0.07,0.11,0.17] // 0 1 2 3 4

    const padding = 40;

    let words = [];

    const gelenwords = useRef([]);

    const pool = useRef([]);
    const animationFrameId = useRef(null);
    const lastTime = useRef(0);

    const user = useRef("Guest");
    const canvasRef = useRef(null);
    const canvas = useRef(null);
    const ctx = useRef(null);

    const [heart,setHeart] = useState(5);
    const refHeart = useRef(5);
    const unknownWords = useRef([]);
    const [counter,setCounter] = useState(0);
    const counterRef = useRef(0);
    const [gameEnded, setGameEnded] = useState(false);
    const oldWords = useRef([]);
    const [showCountDown,setShowCountDown] = useState(false);
    const [isFirst, setIsFirst] = useState(true);
    const level = useRef(2);
    const userName = useRef("Anonim");

    const clearCanvas = () => {
        ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    };

    const drawText = (x,y,text,fillStyle = "white",font = "30px Arial") => {
        ctx.current.font = font;
        ctx.current.fillStyle = fillStyle; 
        ctx.current.fillText(text, x, y); // (x=50, y=50)
    };

    const generateHash = async (text) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        return hashHex;
    };

    const loop = () => {
        const deltaTime = lastTime.current != 0 ? performance.now() - lastTime.current : 0;
    
        clearCanvas();
        if (refHeart.current > 0) {
            for (let i = 0; i < pool.current.length; i++) {
                try {
                    let element = pool.current[i];
                    element.y += deltaTime * element.speed;
    
                    if (element.y > canvas.current.height + 30) {
                        unknownWords.current.push(element);
                        setHeart((prevHeart) => prevHeart - 1);
                        refHeart.current -= 1;
                        pool.current.splice(i, 1);
    
                        if (refHeart.current === 0) {
                            console.log("Game Over");
                            setGameEnded(true);
                        }
    
                        // Yeni kelime eklemek
                        let a;
                        do {
                            a = Math.floor(Math.random() * gelenwords.current.length); // Rastgele bir kelime seç
                        } while (oldWords.current.includes(gelenwords.current[a].eng) || pool.current.some(w => w.eng === gelenwords.current[a].eng)); 
                        // Eğer kelime oldWords içinde veya pool'da varsa, tekrar dene
    
                        let xx = gelenwords.current[a];
    
                        const textWidth = measureTextWidth(xx.eng); // Yazının genişliği
                        let minDistance = 20;
                        let newX;
                        let isValidX = false;
                        while (!isValidX) {
                            newX = Math.floor(Math.random() * ((canvas.current.width - padding - textWidth) - padding + 1)) + padding;
                            isValidX = !pool.current.some(w => Math.abs(w.x - newX) < minDistance);
                        }
    
                        const word = {
                            id: i,
                            eng: xx.eng,
                            tr: xx.tr,
                            tr_hash: xx.tr_hash,
                            x: newX,
                            y: Math.floor(Math.random() * ((canvas.current.height / 2 - padding) - padding + 1)) + padding,
                            speed: speed.current,
                        };
    
                        pool.current.push(word);
                        oldWords.current.push(xx.eng); // Yeni kelimeyi oldWords'a ekle
                    }
    
                    drawText(element.x, element.y, element.eng, "white", "30px Montserrat");
                } catch (e) {
                    console.error(e);
                }
            }
        }
    
        lastTime.current = performance.now();
        animationFrameId.current = requestAnimationFrame(loop);
    };
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const restartGame = async () => {
        window.location.reload();

        /*
        pool.current = [];

        // start animation
        setShowCountDown(true);
        setGameEnded(false);
        setCounter(0);
        counterRef.current = 0;
        setHeart(5);

        await sleep(3000);

        setShowCountDown(false);

        
        initGame();
        refHeart.current = 5;
        animationFrameId.current = requestAnimationFrame(loop);
        unknownWords.current = [];
        */
    }

    const measureTextWidth = (text, font = "30px Montserrat") => {
        const span = document.createElement("span");
        span.style.position = "absolute";
        span.style.whiteSpace = "nowrap"; // Satır kayması engellenir
        span.style.font = font;
        span.innerText = text;
        document.body.appendChild(span);
    
        const textWidth = span.getBoundingClientRect().width; // Gerçek genişlik
        document.body.removeChild(span);
    
        return textWidth;
    };

    const startDelayAnimation = () => {

    }

    const checkIsValidWord = async (e) => {
        if(oldWords.current.length >= gelenwords.current.length){
            setGameEnded(true);
            return;
        }

        let value = e.target.value;
        let hashed = await generateHash(value);
    
        for (let i = 0; i < pool.current.length; i++) {
            const element = pool.current[i];
            for (let j = 0; j < element.tr_hash.length; j++) {
                const hash = element.tr_hash[j];
                if (hash === hashed) {
                    pool.current.splice(i, 1); 
                    setCounter((prev) => prev + 1);
                    counterRef.current += 1;
                    e.target.value = "";
                    
                    
                    // Yeni kelime eklemek
                    let a;
                    do {
                        a = Math.floor(Math.random() * gelenwords.current.length); // Rastgele bir kelime seç
                    } while (oldWords.current.includes(gelenwords.current[a].eng) || pool.current.some(w => w.eng === gelenwords.current[a].eng)); 
                    // Eğer kelime oldWords içinde veya pool'da varsa, tekrar dene
    
                    let xx = gelenwords.current[a];
    
                    const textWidth = measureTextWidth(xx.eng); // Yazının genişliği
    
                    let minDistance = 20;
                    let newX;
                    let isValidX = false;
                    while (!isValidX) {
                        newX = Math.floor(Math.random() * ((canvas.current.width - padding - textWidth) - padding + 1)) + padding;
                        isValidX = !pool.current.some(w => Math.abs(w.x - newX) < minDistance);
                    }
    
                    const word = {
                        id: i,
                        eng: xx.eng,
                        tr: xx.tr,
                        tr_hash: xx.tr_hash,
                        x: Math.floor(Math.random() * ((canvas.current.width - padding - textWidth) - padding + 1)) + padding,
                        y: Math.floor(Math.random() * ((canvas.current.height / 2 - padding) - padding + 1)) + padding,
                        speed: speed.current,
                    };
    
                    pool.current.push(word);
                    oldWords.current.push(xx.eng); // Yeni kelimeyi oldWords'a ekle
                }
            }
        }
    };
    
    

    const initGame = async () => {
        const selectedWords = []; // Yeni seçilen kelimeleri burada tutacağız
        
        for (let i = 0; i < wordsCount; i++) {
            let a;
            do {
                a = Math.floor(Math.random() * gelenwords.current.length); // Rastgele bir kelime seç
            } while (oldWords.current.includes(gelenwords.current[a].eng) || selectedWords.includes(gelenwords.current[a].eng)); 
            // Eğer kelime oldWords içinde veya selectedWords içinde varsa, tekrar dene
    
            selectedWords.push(gelenwords.current[a].eng); // Yeni kelimeyi selectedWords'a ekle
            words.push(gelenwords.current[a]); // Kelimeyi words dizisine ekle
        }
    
        // Seçilen kelimeleri ekranda göstermek için
        for (let i = 0; i < words.length; i++) {
            const element = words[i];
            const textWidth = measureTextWidth(element.eng); // Yazının genişliği
    
            let min_distance = 40;
            let newX;
            let isValidX = false;
            while (!isValidX) {
                newX = Math.floor(Math.random() * ((canvas.current.width - padding - textWidth) - padding + 1)) + padding;
                isValidX = !pool.current.some(w => Math.abs(w.x - newX) < min_distance);
            }
    
            const word = {
                id: i,
                eng: element.eng,
                tr: element.tr,
                tr_hash: element.tr_hash,
                x: newX,
                y: Math.floor(Math.random() * ((canvas.current.height / 2 - padding) - padding + 1)) + padding,
                speed: speed.current,
            };
    
            pool.current.push(word);
        }
    };
    
    

    useEffect(() => {
        if(Cookies.get("user")){
            user.current = Cookies.get("user")
        };
    },[]);

    useEffect(() => {
        //startGame();
    }, []);

    const startGame = async (levelx,uname) => {
        userName.current = uname;
        console.log(userName.current);
        setIsFirst(false);
        await sleep(100);

        level.current = levelx;
        gelenwords.current = getWords(level.current);
        speed.current = diff[level.current];

        canvas.current = canvasRef.current;
        ctx.current = canvas.current.getContext("2d");

        setShowCountDown(true);
        setGameEnded(false);
        setCounter(0);
        counterRef.current = 0;
        setHeart(5);

        await sleep(3000);

        setShowCountDown(false);

        initGame();
        animationFrameId.current = requestAnimationFrame(loop);
    }

    return (
            <div className={styles.mainContainer}>
                {
                    isFirst ?
                    <WelcomeMenu start={startGame} /> 
                    :

                    <div className={styles.gameContainer}>
                        <canvas ref={canvasRef} className={styles.canvas} width={900} height={500} ></canvas>
                        <div className={styles.bottomContainer}>
                            <div className={styles.heartContainer}>
                                {Array.from({ length: heart }).map((_, i) => (
                                    <FaHeart key={i} size={20} className={styles.hearts}/>
                                ))}
                            </div>
                            <input type="text" onChange={checkIsValidWord} className={styles.answerInput} />
                            <div className={styles.heartContainer}>
                                <span className={styles.counter}>{counter}</span>
                            </div>
                        </div>
                    </div>  
                }
                {   showCountDown ? 
                    <div className={styles.countDownText}>
                        <CountDown />
                    </div> : null
                }

                <div className={styles.gameend}>
                    {gameEnded ? <GameEnd score={counter} unknownWords={unknownWords.current} restartFunc={restartGame} /> : null}
                </div>
                
            </div>

        
    )
}

export default Game1;