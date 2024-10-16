import { BrowserRouter, Routes, Route } from 'react-router-dom' 

import './App.css'
import Game from './pages/Game'
import Settings from './pages/Settings'

function App() {
  

  return (

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Settings />}/>
          <Route path='/game' element={<Game />}/>
        </Routes>
      </BrowserRouter>

  )
}

export default App
