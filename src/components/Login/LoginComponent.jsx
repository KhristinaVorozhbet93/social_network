import style from "./Login.module.css";
import LoginFormComponent from "./LoginFormComponent";
import ImageStartComponent from "../ImageStartComponent";
import PawComponent from "../Paw/PawComponent";
import FooterComponent from "../FooterComponent";

function LoginComponent({ image }) {
    return (
        <div className={style.main}>
            <PawComponent />
            <hr />
            <div className={style.container}>
                <ImageStartComponent image={image} />
                <LoginFormComponent />                     
            </div>
            <FooterComponent/>   
        </div>
    );
};

export default LoginComponent; 