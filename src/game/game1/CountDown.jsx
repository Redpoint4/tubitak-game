import { useState, useEffect } from 'react';
import styles from './CountDown.module.css';


const CountDown = () => {

  const [count,setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return(
      <div className={styles.counter}>
        <span>
          {
            count > 0 ? count : "Başla!"
          }
        </span>
      </div>    
  )
}


export default CountDown;