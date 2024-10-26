import RegistrationFormComponent from "./RegistrationFormComponent";
import style from "./Registration.module.css";
import ImageStartComponent from "../ImageStartComponent";

function RegistrationComponent ({ image }) {
    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <ImageStartComponent />
                <RegistrationFormComponent />
            </div>
        </div>
    );
};

export default RegistrationComponent; 