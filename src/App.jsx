import Admin from './adminpanel/Admin'
import Game1 from './game/game1/Game1';
import { Routes, Route } from "react-router-dom";
import './App.css'

function App() {

  return (
    <Routes className='root'>
      <Route path="/tubitak-game" element={<Game1 />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<br/>} />
    </Routes>
  )
}

export default App
