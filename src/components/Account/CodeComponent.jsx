import style from "./CodeComponent.module.css";
import CodeFormComponent from "../Account/CodeFormComponent";
import ImageStartComponent from "../ImageStartComponent";

function CodeComponent({ image }) {
    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <ImageStartComponent image={image} />
                <CodeFormComponent />
            </div>
        </div>
    );
};

export default CodeComponent; 