import { useState } from "react";
import LoginComponent from "./LoginComponent";
import RegistrationComponent from "./RegistrationComponent";

function SocialNetwork() {
    const [showAccount, setShowAccount] = useState(false);


    const handleClick = () => {
        setShowAccount(true);
    };

    return (
        <div>
            <LoginComponent />
        </div>
    );
}

export default SocialNetwork;