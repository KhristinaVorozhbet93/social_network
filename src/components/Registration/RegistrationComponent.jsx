import RegistrationFormComponent from "./RegistrationFormComponent";
import style from "./Registration.module.css";
import FooterComponent from "../FooterComponent";

function RegistrationComponent() {
    return (
        <div className={style.container}>
            <div className={style.main}>
                <RegistrationFormComponent />
            </div>
            <FooterComponent />
        </div>
    );
};

export default RegistrationComponent; 