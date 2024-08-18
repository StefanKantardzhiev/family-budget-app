import React from 'react';
import logo from './cash.png';
import './App.css';
import { Routes } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./components/Home/Home";
import './i18n';
import i18n, {t} from "i18next"; // This imports and runs your i18n configuration
function App() {
  return (
    <div className="App">
       <header className="App-header">
          <img src={logo} className={'App-logo'} alt="logo" height={50} width={50}/>
          <div className="language-buttons">
             <button className='lang-button' onClick={() => changeLanguage('en')}>{t('English')}</button>
             <button className='lang-button' onClick={() => changeLanguage('bg')}>{t('Bulgarian')}</button>
          </div>
       </header>
       <Router>
          <Routes>
             <Route path="/" element={<Home/>}/>
          </Routes>
       </Router>
    </div>
  )
    ;
}
const changeLanguage = async (language: string): Promise<void> => {
   await i18n.changeLanguage(language);
   console.log('Language changed to:', language);
};
export default App;