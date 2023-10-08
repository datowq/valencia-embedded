import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Emote from './Emote'
import Resume from './Resume'

const App = () => {

  const base = '/valencia-embeded'

  return (
    <Router>
      <Routes>
        <Route path={`${base}/`} element={<Emote />} />
        <Route path={`${base}/resume`}  element={<Resume />} />
        <Route path={`${base}/about`}  element={<Resume />} />
        <Route path={`${base}/contact`}  element={<Resume />} />
        <Route path={`${base}/projects`}  element={<Resume />} />
        <Route path={`${base}/credits`}  element={<Resume />} />
      </Routes>
    </Router>
  )
}

export default App
