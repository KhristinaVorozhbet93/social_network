import Header from "../Header";
import Footer from "../Footer";
import Aside from "../Aside";


function UserProfileComponent()
{
    return(
    <>
    <Header></Header>
    <Aside></Aside>
    <Footer></Footer>
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
    //доделать авторизацию в localStorage сохранить его и уже использовать дальше
    //проблема забыли пароль не реализована 
}

export default UserProfileComponent;