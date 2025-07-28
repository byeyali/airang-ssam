import React from 'react';
import "./App.css";
import MainContainer from './components/MainContainer/MainContainer';
import Header from './components/Header/Header';
import Navigation from "./components/Navigation/Navigation";
import SignUp from './pages/Signup/SignUp';

function App() {
  return (
    	<> 
      <MainContainer>
        <SignUp /> 
      </MainContainer>

    </>
  );
}

export default App;
