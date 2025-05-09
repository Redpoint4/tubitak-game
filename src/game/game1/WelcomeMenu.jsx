import { useState } from 'react'
import styles from './WelcomeMenu.module.css'


const WelcomeMenu = (props) => {
    
    const [level, setLevel] = useState(1);


    function getButtonColor(id){
        return id == level ? {color:"white"} : {color:"rgb(90, 90, 90)"}
    }

    return (
        <div className={styles.container}>
            <span>Hızlı Ol, Bil!</span>

            <button className={styles.startBtn} onClick={() => {props.start(level)}}>Başla!</button>

            <div className={styles.settingsDiv}>
                <button onClick={() => {setLevel(0)}} style={getButtonColor(0)}>Çok Kolay</button>
                <button onClick={() => {setLevel(1)}} style={getButtonColor(1)}>Kolay</button>
                <button onClick={() => {setLevel(2)}} style={getButtonColor(2)}>Orta</button>
                <button onClick={() => {setLevel(3)}} style={getButtonColor(3)}>Zor</button>
                <button onClick={() => {setLevel(4)}} style={getButtonColor(4)}>Çok Zor</button>
            </div>
        </div>
    )

}

export default WelcomeMenu