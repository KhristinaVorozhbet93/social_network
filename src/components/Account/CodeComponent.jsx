import style from "./CodeComponent.module.css";
import CodeFormComponent from "../Account/CodeFormComponent";
import ImageStartComponent from "../ImageStartComponent";
import FooterComponent from "../FooterComponent";

function CodeComponent({ image }) {
    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <ImageStartComponent image={image} />
                <CodeFormComponent />
            </div>
            <FooterComponent />
        </div>
    );
};

export default CodeComponent; 