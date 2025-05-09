import styles from './GameEnd.module.css';
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa";
import { useState } from 'react';

const GameEnd = (props) => {

    const [sideBoxOpened, setSideBoxOpened] = useState(false);



    return(
        <div className={styles.container}>
            <div className={styles.top}>
                <span>Oyun Bitti</span>
                {
                    !sideBoxOpened ? 
                    <FaAngleRight className={styles.toggleButton} onClick={() => {setSideBoxOpened(!sideBoxOpened)}}/>
                    :
                    <FaAngleLeft className={styles.toggleButton} onClick={() => {setSideBoxOpened(!sideBoxOpened)}}/>
                }

            </div>
            <div className={styles.mid}>
                <div className={styles.midLeft}>
                    <span className={styles.scoreText}>Bulduğunuz Kelimeler</span>
                    <span className={styles.scoreNumber}>{props.score}</span>
                </div>
                <div className={styles.midRight}>
                    <span className={styles.scoreText}>Bulunamayan Kelimeler</span>
                    <span className={styles.scoreNumber}>{props.unknownWords.length}</span>
                </div>
            </div>
            <div className={styles.bottom}>
                <button className={styles.tryAg} onClick={props.restartFunc}>Tekrar Dene</button>
            </div>

            {
                sideBoxOpened ? 
                <div className={styles.sideBox}>
                    {
                        props.unknownWords.map((element, index) => (
                            <span key={index}>{element.eng} : {element.tr[0]}</span>
                        ))
                    }
                </div> :
                null
            }

        </div>
    )
}


export default GameEnd