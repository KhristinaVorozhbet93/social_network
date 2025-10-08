//import logo from './logo.svg';
import { createContext, useContext } from 'react';
import './App.css';
import BaseApiClient from './api-client/account-api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationComponent from './components/Registration/RegistrationComponent';
import LoginComponent from './components/Login/LoginComponent';
import UserProfileComponent from './components/UserProfile/UserProfileComponent';
import ForgotPasswordComponent from './components/Account/ForgotPasswordComponent';
import CodeComponent from './components/Account/CodeComponent';
import PetProfileComponent from './components/PetProfile/PetPfofileComponent';
import FriendsListComponent from './components/Friends/FriendsComponent';
import FriendsSearchComponent from './components/Friends/FriendsSearchComponent';
import PetProfileFormComponent from './components/PetProfile/PetProfileFormComponent';
import PetPhotoUploadForm from './components/PetProfile/PetPhotoUploadForm';
import PetFullPhotoGallery from './components/PetProfile/PetFullPhotoGallery';
import UserProfilePhotoGallery from './components/UserProfile/UserProfilePhotoGallery';
import UserPhotoUploadForm from './components/UserProfile/UserPhotoUploadForm';
import ChatComponent from './components/Chat/ChatComponent';
import ChatFormComponent from './components/Chat/ChatFormComponent';
import PetProfileUpdateComponent from './components/PetProfile/PetProfileUpdateComponent';
import PetProfileViewComponent from './components/PetProfile/PetProfileViewComponent';
import UserProfileViewComponent from './components/UserProfile/UserProfileViewComponent';
import UserProfileUpdateComponent from './components/UserProfile/UserProfileUpdateComponent';
import UserFrinedListViewComponent from './components/UserProfile/UserFrinedListViewComponent';
import UserPetsistViewComponent from './components/UserProfile/UserPetsListViewComponent';
import UpdatePasswordAccount from './components/Account/UpdatePasswordComponent';
import DayComponent from './components/Planner/DayComponent';
import Calendar from './components/Planner/Calendar';
import FriendsComponent from './components/Friends/FriendsComponent';

const AccountApiContext = createContext(null); // Инициализируем createContext с null

// function App({ children }) {
//   const host = "https://localhost:7052/"; // Определяем хост
//   const authClient = new AuthClient(host); // Создаем экземпляр AuthClient
//   //const petProfileClient = new PetProfileClient(host); // Создаем экземпляр PetProfileClient

//   // Создаем объект, содержащий все API-клиенты
//   const apiClients = {
//     auth: authClient
//     // Здесь можно добавить другие API-клиенты (например, FriendClient, UserProfileClient)
//   };

//   return (
//     <AccountApiContext.Provider value={apiClients}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/auth/login" element={<LoginComponent />} />
//           <Route path="/auth/registration" element={<RegistrationComponent />} />
//           <Route path="/auth/password" element={<ForgotPasswordComponent />} />
//           <Route path="/auth/code" element={<CodeComponent />} />

//           <Route path="/profile/pet" element={<PetProfileComponent />} />
//           <Route path="/profile/pet/:id/add-photo" element={<PetPhotoUploadForm />} />
//           <Route path="/profile/pet/:id/photos" element={<PetFullPhotoGallery />} />
//           <Route path="/profile/pet/:id" element={<ViewPetProfileComponent />} />
//           <Route path="/profile/pet/create" element={<PetProfileFormComponent />} />
//           <Route path="/profile/pet/:id/update" element={<UpdatePetProfileComponent />} />

//           <Route path="/friends" element={<FriendsListComponent />} />
//           <Route path="/friends/search" element={<FriendsSearchComponent />} />
//           <Route path="/profile/user" element={<UserProfileComponent />} />
//           <Route path="/profile/user/:id/photos" element={<UserProfilePhotoGallery />} />
//           <Route path="/profile/user/:id" element={<ViewProfileComponent />} />
//           <Route path="/profile/user/add-photo" element={<UserPhotoUploadForm />} />
//           <Route path="/profile/user/update" element={<UpdateUserProfileComponent />} />
//           <Route exact path="/" element={<LoginComponent />} />
//         </Routes>
//       </BrowserRouter>
//     </AccountApiContext.Provider>
//   );
// }



function App() {
  const accountApiClient = new BaseApiClient();
  return (
    <div>
      <AccountApiContext.Provider value={accountApiClient}>
        <BrowserRouter>
          <Routes> 
            <Route path="/auth/login" element={<LoginComponent />} />
            <Route path="/auth/registration" element={<RegistrationComponent />} />
            <Route path="/auth/password" element={<ForgotPasswordComponent />} />
            <Route path="/auth/code" element={<CodeComponent />} />   
            <Route path="/auth/password/update" element={<UpdatePasswordAccount />} />   

            <Route path="/profile/pet" element={<PetProfileComponent />} />
            <Route path="/profile/pet/:id/add-photo" element={<PetPhotoUploadForm />} />
            <Route path="/profile/pet/:id/photos" element={<PetFullPhotoGallery />} />
            <Route path="/profile/pet/:id" element={<PetProfileViewComponent />} />
            <Route path="/profile/pet/create" element={<PetProfileFormComponent />} />           
            <Route path="/profile/pet/:id/update" element={<PetProfileUpdateComponent />} />

            <Route path="/friends" element={<FriendsComponent />} />
            <Route path="/friends/search" element={<FriendsSearchComponent />} />
            <Route path="/profile/user" element={<UserProfileComponent />} />
            <Route path="/profile/user/:id/photos" element={<UserProfilePhotoGallery />} />
            <Route path="/profile/user/:id" element={<UserProfileViewComponent />} />
            <Route path="/profile/user/add-photo" element={<UserPhotoUploadForm/>} />
            <Route path="/profile/user/update" element={<UserProfileUpdateComponent/>} />
            <Route path="/profile/user/:id/friends" element={<UserFrinedListViewComponent/>} />
            <Route path="/profile/user/:id/pets" element={<UserPetsistViewComponent/>} />

            <Route path="/chats" element={<ChatComponent />} />   
            <Route path="/chat/:id" element={<ChatFormComponent />} />  

            <Route exact path="/calendar/day" element={<DayComponent />} />

            <Route path="/calendar" element={<Calendar />} />  
            <Route exact path="/" element={<LoginComponent />} />

          </Routes>
        </BrowserRouter>
      </AccountApiContext.Provider>
    </div>
  );
}
export const useAccountApi = () => useContext(AccountApiContext);
export default App;
