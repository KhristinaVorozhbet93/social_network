import HeaderComponent from "../HeaderComponent";
import AsideComponent from "../AsideComponent";
import FooterComponent from "../FooterComponent";
import style from "./UserProfileComponent.module.css";

function UserProfileComponent() {
    return (
        <div className={style.container}>
            <HeaderComponent></HeaderComponent>
            <AsideComponent></AsideComponent>
            <FooterComponent></FooterComponent>
        </div>
    )
}

export default UserProfileComponent;