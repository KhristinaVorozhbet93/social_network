import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "./Login/LoginComponent";
import RegistrationComponent from "./Registration/RegistrationComponent";


function SocialNetwork() {
    const [showAccount, setShowAccount] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setShowAccount(true); 
      }
    }, []); 
  
    return (
      <div>
        {showAccount && <LoginComponent />} 
      </div>
    );
  }

export default SocialNetwork;