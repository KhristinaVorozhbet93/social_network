import { useEffect, useState } from "react";
import { useAccountApi } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import HeaderComponent from "../HeaderComponent";
import AsideComponent from "../AsideComponent";
import FooterComponent from "../FooterComponent";
import style from './Friends.module.css';

function FriendsListComponent() {
    const
        [friends, setFriends] = useState([]),
        [loading, setLoading] = useState(true),
        [friendProfiles, setFriendProfiles] = useState([]),
        navigate = useNavigate(),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const accountId = localStorage.getItem('accountId');
                const response = await accountApi.getFriends(accountId);
                setFriends(response);
                const fetchProfiles = async () => {
                    const profiles = [];
                    for (const friend of response) {
                        const profile = await accountApi.getUserProfile(friend.friendId);
                        profiles.push(profile);
                    }
                    setFriendProfiles(profiles);
                }
                if (response && response.length > 0) {
                    fetchProfiles();
                }

            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);


    if (loading) {
        return <div>Загрузка...</div>;
    }

    const handleClick = (id) => {
        navigate(`/profile/user/${id}`);
    }
    
    const handleSearchClick = () => {
        navigate('/friends/search');
    };

    if (friends.length === 0) {
        return (
            <div className={style.container}>
                <HeaderComponent />
                <div className={style.content}>
                    <AsideComponent />
                    <div className={style.main_content}>
                        У вас пока нет друзей. <button onClick={handleSearchClick}>Найти друзей</button>
                    </div>
                </div>
                <FooterComponent />
            </div>
        );
    }

    return (
        <div className={style.container}>
            <HeaderComponent />
            <div className={style.content}>
                <AsideComponent />
                <div className={style.main_content}>
                    <button onClick={handleSearchClick}>Поиск</button>
                    <ul>
                        {friendProfiles.map((profile) => (
                            <li key={profile.id} onClick={() => handleClick(profile.id)}>
                                {profile.firstName} {profile.lastName}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default FriendsListComponent;