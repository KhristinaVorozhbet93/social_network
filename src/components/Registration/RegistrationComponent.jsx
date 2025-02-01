import RegistrationFormComponent from "./RegistrationFormComponent";
import style from "./Registration.module.css";
import ImageStartComponent from "../ImageStartComponent";
import FooterComponent from "../FooterComponent";

function RegistrationComponent({ image }) {
    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <ImageStartComponent />
                <RegistrationFormComponent />
            </div>
            <FooterComponent />
        </div>
    );
};

export default RegistrationComponent; 