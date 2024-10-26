//import logo from './logo.svg';
import { createContext, useContext } from 'react';
import './App.css';
import SocialNetwork from './components/SocialNetwork';
import AccountClient from './api-client/account-api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationComponent from './components/Registration/RegistrationComponent';
import LoginComponent from './components/Login/LoginComponent';
import UserProfileComponent from './components/UserProfile/UserProfileComponent';

const AccountApiContext = createContext();

function App() {
  const accountApiClient = new AccountClient();
  return (
    <div>
      <AccountApiContext.Provider value={accountApiClient}>
        <BrowserRouter>
          <Routes> 
            <Route path="/auth/login" element={<LoginComponent />} />
            <Route path="/auth/registration" element={<RegistrationComponent />} />
            <Route path="/profile/user" element={<UserProfileComponent />} />
          </Routes>
          <SocialNetwork />
        </BrowserRouter>
      </AccountApiContext.Provider>
    </div>
  );
}
export const useAccountApi = () => useContext(AccountApiContext);
export default App;
