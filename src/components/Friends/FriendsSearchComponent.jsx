import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderComponent from "../HeaderComponent";
import AsideComponent from "../AsideComponent";
import FooterComponent from "../FooterComponent";
import style from './Friends.module.css';
import { useAccountApi } from "../../App";

function FriendsSearchComponent() {
    const
        [firstName, setFirstName] = useState(''),
        [lastName, setLastName] = useState(''),
        [searchResults, setSearchResults] = useState([]),
        [notFound, setNotFound] = useState(false),
        navigate = useNavigate(),
        accountApi = useAccountApi();

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const response = await accountApi.findFriends(firstName, lastName);

        setSearchResults(response);
        setNotFound(response.length === 0);
    };

    const handleClick = (id) => {
        navigate(`/profile/user/${id}`);
    }

    return (
        <div className={style.container}>
            <HeaderComponent />
            <div className={style.content}>
                <AsideComponent />
                <div className={style.main_content}>
                    <form onSubmit={handleSearchSubmit}>
                        <div>
                            <label htmlFor="firstName">Имя:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={handleFirstNameChange}
                                placeholder="Имя"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">Фамилия:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={handleLastNameChange}
                                placeholder="Фамилия"
                            />
                        </div>
                        <button type="submit">Найти</button>
                    </form>
                    {notFound ? (
                        <div>
                            По вашему запросу ничего не найдено.
                        </div>
                    ) : searchResults.length > 0 && (
                        <div>
                            <h2>Результаты поиска:</h2>
                            <ul>
                                {searchResults.map((result) => (
                                    <li key={result.id}>
                                        <li key={result.id} onClick={() => handleClick(result.id)}>
                                            {result.firstName} {result.lastName}
                                        </li>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}


export default FriendsSearchComponent;