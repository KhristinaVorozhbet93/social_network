import style from "./ForgotPasswordComponent.module.css";
import ForgotPasswordFormComponent from "../Account/ForgotPasswordFormComponent";
import FooterComponent from "../FooterComponent";

function ForgotPasswordComponent() {
    return (
        <div className={style.container}>
            <div className={style.main}>
                <ForgotPasswordFormComponent />
            </div>
            <FooterComponent />
        </div>
    );
};

export default ForgotPasswordComponent; 