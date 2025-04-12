import style from "./CodeComponent.module.css";
import CodeFormComponent from "../Account/CodeFormComponent";
import FooterComponent from "../FooterComponent";

function CodeComponent({ image }) {
    return (
        <div className={style.container}>
            <div className={style.main}>
                <CodeFormComponent />
            </div>
            <FooterComponent />
        </div>
    );
};

export default CodeComponent; 