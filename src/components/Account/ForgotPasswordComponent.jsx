import style from "./ForgotPasswordComponent.module.css";
import ForgotPasswordFormComponent from "../Account/ForgotPasswordFormComponent";
import ImageStartComponent from "../ImageStartComponent";

function ForgotPasswordComponent({ image }) {
    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <ImageStartComponent image={image} />
                <ForgotPasswordFormComponent />
            </div>
        </div>
    );
};

export default ForgotPasswordComponent; 