import easy from './jsons/easy.json'
import normal from './jsons/normal.json'
import ultra_easy from './jsons/ultra_easy.json'
import hardest from './jsons/hardest.json'


export default function getWords(difficulty) {
    switch (difficulty) {
        case 0:
            return ultra_easy
        case 1:
            return easy
        case 2:
            return normal
        case 3:
            return hardest
        case 4:
            return hardest
    }   
}
