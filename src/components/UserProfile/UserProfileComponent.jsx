import HeaderComponent from "../HeaderComponent";
import AsideComponent from "../AsideComponent";
import FooterComponent from "../FooterComponent";
import style from "./UserProfileComponent.module.css";

function UserProfileComponent() {
    return (
        <>
            <HeaderComponent></HeaderComponent>
            <AsideComponent></AsideComponent>
            <FooterComponent></FooterComponent>
        </>)


    //Сделать на выходных:
    //будет состоять из маленьких компонентов:
    //Header
    //Asider
    //1. Фото профиля
    //2. Данные о себе
    //3. Друзья онлайн
    //4. Загруженные фото
    //Footer

    //сейчас нужно сделать Header, Footer, Asider
    //проблема забыли пароль не реализована 
}

export default UserProfileComponent;