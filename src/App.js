//import logo from './logo.svg';
import { createContext, useContext } from 'react';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import SocialNetwork from './components/SocialNetwork';
import AccountClient from './api-client/account-api';
import UpdateAccountData from './components/Account/UpdateAccountData';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';

const AccountApiContext = createContext();

function App() {
  const accountApiClient = new AccountClient();
  return (
    <div>
      <AccountApiContext.Provider value={accountApiClient}>
        <BrowserRouter>
          <Routes> 
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/registration" element={<Registration />} />
          </Routes>
          <SocialNetwork />
        </BrowserRouter>
      </AccountApiContext.Provider>
    </div>
  );
}
export const useAccountApi = () => useContext(AccountApiContext);
export default App;
