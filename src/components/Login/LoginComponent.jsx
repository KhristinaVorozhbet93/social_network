import style from "./Login.module.css";
import LoginFormComponent from "./LoginFormComponent";
import FooterComponent from "../FooterComponent";

function LoginComponent() {
    return (
        <div className={style.container}>
            <div className={style.main}>
                <LoginFormComponent />
            </div>
            <FooterComponent />
        </div>
    );
};

export default LoginComponent; 