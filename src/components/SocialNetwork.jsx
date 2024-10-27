import { useState, useEffect} from "react";
import LoginComponent from "./Login/LoginComponent";

function SocialNetwork() {
    const [showAccount, setShowAccount] = useState(false);
    
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