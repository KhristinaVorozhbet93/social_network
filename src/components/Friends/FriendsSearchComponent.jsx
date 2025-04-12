import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountApi } from "../../App";
import style from './FriendsSearchComponent.module.css';
import { CircularProgress } from '@mui/material';

function FriendsSearchComponent() {
    const
        [searchResults, setSearchResults] = useState([]),
        [notFound, setNotFound] = useState(false),
        [search, setSearch] = useState(''),
        [loading, setLoading] = useState(false),
        navigate = useNavigate(),
        accountApi = useAccountApi();

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); 
        setNotFound(false); 
        let firstName = ''; 
        let lastName = ''; 
        const words = search.trim().split(/\s+/);
    
        if (words.length > 0) {
            firstName = words[0];
        }
        if (words.length > 1) {
            lastName = words.slice(1).join(' '); 
        }
        const response = await accountApi.findFriends(firstName, lastName);
        setSearchResults(response);
        setNotFound(response.length === 0);
        setLoading(false); 
    };

    const handleClick = (id) => {
        navigate(`/profile/user/${id}`);
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value); 
    };
    
    return (
        <div className={style.searchContainer}>
            <form className={style.searchForm} onSubmit={handleSearchSubmit}>
                <div className={style.formRow}>
                    <label htmlFor="search">Поиск:</label>
                    <input
                        type="text"
                        id="search"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Имя и фамилия"
                        disabled={loading} 
                    />
                </div>
                <button type="submit" className={style.searchButton} disabled={loading}>
                    {loading ? (
                        <CircularProgress size={24} color="inherit" /> 
                    ) : (
                        "Найти"
                    )}
                </button>
            </form>
            {notFound ? (
                <div className={style.notFound}>
                    По вашему запросу ничего не найдено
                </div>
            ) : searchResults.length > 0 && (
                <div>
                    <h2>Результаты поиска:</h2>
                    <ul className={style.searchResultsList}>
                        {searchResults.map((result) => (
                            <li key={result.id} onClick={() => handleClick(result.id)}>
                                {result.photoUrl && (
                                    <img
                                        src={result.photoUrl}
                                        alt={`${result.firstName} ${result.lastName}`}
                                        className={style.resultPhoto}
                                    />
                                )}
                                {result.firstName} {result.lastName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


export default FriendsSearchComponent;