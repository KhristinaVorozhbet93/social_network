//import logo from './logo.svg';
import { createContext, useContext } from 'react';
import './App.css';
import SocialNetwork from './components/SocialNetwork';
import AccountClient from './api-client/account-api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationComponent from './components/Registration/RegistrationComponent';
import LoginComponent from './components/Login/LoginComponent';
import UserProfileComponent from './components/UserProfile/UserProfileComponent';
import ForgotPasswordComponent from './components/Account/ForgotPasswordComponent';
import CodeComponent from './components/Account/CodeComponent';
import PetProfileComponent from './components/PetProfile/PetPfofileComponent';
import UpdateUserProfileComponent from './components/UserProfile/UpdateUserProfileCpmponent';
import FriendsListComponent from './components/Friends/FriendsListComponent';
import FriendsSearchComponent from './components/Friends/FriendsSearchComponent';
import ViewProfileComponent from './components/UserProfile/ViewProfileCpmponent';
// import UpdateUserProfileComponent from './components/UserProfile/UpdateUserProfileComponent';

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
            <Route path="/auth/password" element={<ForgotPasswordComponent />} />
            <Route path="/auth/code" element={<CodeComponent />} />
            <Route path="/profile/user" element={<UserProfileComponent />} />
            <Route path="/profile/user/update" element={<UpdateUserProfileComponent/>} />
            <Route path="/profile/pet" element={<PetProfileComponent />} />
            <Route path="/friends" element={<FriendsListComponent />} />
            <Route path="/friends/search" element={<FriendsSearchComponent />} />
            <Route path="/profile/user/:id" element={<ViewProfileComponent />} />
            <Route exact path="/" element={<SocialNetwork />} />
          </Routes>
        </BrowserRouter>
      </AccountApiContext.Provider>
    </div>
  );
}
export const useAccountApi = () => useContext(AccountApiContext);
export default App;
