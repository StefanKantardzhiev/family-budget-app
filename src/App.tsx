import React from 'react';
import logo from './cash.png';
import './App.css';
import { Routes } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./components/Home/Home";
import './i18n'; // This imports and runs your i18n configuration
function App() {
  return (
    <div className="App">
       <header className="App-header">
          <img src={logo} className={'App-logo'} alt="logo" height={50} width={50}/>
       </header>
       <Router>
          <Routes>
             <Route path="/home" element={<Home/>}/>
          </Routes>
       </Router>
    </div>
  )
    ;
}
export default App;