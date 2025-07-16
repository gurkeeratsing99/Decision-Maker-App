import History from './view/History';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignIn from './view/SignIn';
import SignUp from './view/SignUp';
import Home from './view/Home';
import Search from './view/Search';     // create this page
import Surprise from './view/Surprise';

function App() {
  const [count, setCount] = useState(0)

  return (
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/surprise" element={<Surprise />} />

      </Routes>
    </Router>
  );
}

export default App
