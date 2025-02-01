import style from "./ForgotPasswordComponent.module.css";
import ForgotPasswordFormComponent from "../Account/ForgotPasswordFormComponent";
import ImageStartComponent from "../ImageStartComponent";
import FooterComponent from "../FooterComponent";

function ForgotPasswordComponent({ image }) {
    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <ImageStartComponent image={image} />
                <ForgotPasswordFormComponent />
            </div>
            <FooterComponent />
        </div>
    );
};

export default ForgotPasswordComponent; 