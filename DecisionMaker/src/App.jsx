import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './view/SignIn';
import SignUp from './view/SignUp';
import Home from './view/Home';
import Search from './view/Search';     
import Surprise from './view/Surprise';
import History from './view/History';
import Loves from './view/Loves';

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
        <Route path="/history" element={<History />} />
        <Route path="/loves" element={<Loves />} />

      </Routes>
    </Router>
  );
}

export default App
