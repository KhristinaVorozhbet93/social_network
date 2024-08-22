import { useState } from "react";
import Account from "./Account/Account";
import Login from "./Login";
import Registration from "./Registration";
import App from "../App";

function SocialNetwork() {
    const [showAccount, setShowAccount] = useState(false);


    const handleClick = () => {
        setShowAccount(true);
    };

    return (
            <div>
                <Login />
            </div>
    );
}

export default SocialNetwork;