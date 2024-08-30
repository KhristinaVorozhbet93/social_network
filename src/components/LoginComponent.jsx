import style from "./Login.module.css";
import LoginFormComponent from "./LoginFormComponent";
import ImageStartComponent from "./ImageStartComponent";

function LoginComponent({ image }) {
    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <ImageStartComponent image={image} />
                <LoginFormComponent />
            </div>
        </div>
    );
};

export default LoginComponent; 