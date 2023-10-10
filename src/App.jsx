import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Emote from './Emote'
import Resume from './Resume'

const App = () => {
  return (
    <Router>
      <Routes> 
        <Route path='/resume' element={<Resume />} />
        <Route path='/about'  element={<Resume />} />
        <Route path='/contact' element={<Resume />} />
        <Route path='/projects' element={<Resume />} />
        <Route path='/credits' element={<Resume />} />
        <Route path='/' exact element={<Emote />} />
        <Route path='*' element={<Emote />} />
      </Routes>
    </Router>
  )
}

export default App
