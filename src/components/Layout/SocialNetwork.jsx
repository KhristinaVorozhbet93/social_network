import { useState, useEffect} from "react";
import LoginComponent from "../Login/LoginComponent";
import style from './SocialNetwork.module.css'

function SocialNetwork() {
    const [showAccount, setShowAccount] = useState(false);
    
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setShowAccount(true); 
      }
    }, []); 
  
    return (
      <div className={style.container}>
        {showAccount && <LoginComponent />} 
      </div>
    );
  }
  
export default SocialNetwork;