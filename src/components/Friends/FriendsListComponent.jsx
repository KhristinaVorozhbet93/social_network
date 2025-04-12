import { useEffect, useState } from "react";
import { useAccountApi } from "../../App";
import { useNavigate } from "react-router-dom";
import style from './FriendsListComponent.module.css';
import FriendRequestComponent from "./FriendRequestComponent";
import FriendsSearchComponent from "./FriendsSearchComponent";
import ContentContainer from "../ContentContainer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

function FriendsListComponent() {
    const
        [friends, setFriends] = useState([]),
        [loading, setLoading] = useState(true),
        [activeTab, setActiveTab] = useState('friends'),
        [isMenuOpen, setIsMenuOpen] = useState(false),
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const profileId = localStorage.getItem('profileId');
                const response = await accountApi.getFriends(profileId);
                setFriends(response);

            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, [activeTab, accountApi]);

    const toggleMenu = (profileId) => {
        setIsMenuOpen(isMenuOpen === profileId ? null : profileId);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    const handleClick = (id) => {
        navigate(`/profile/user/${id}`);
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleDeleteFriend = async (id) => {
        await accountApi.removeFriend(profileId, id);
        const response = await accountApi.getFriends(profileId);
        setFriends(response);
    };

    const handleViewProfile = (id) => {
        navigate(`/profile/user/${id}`);
    };

    return (
        <ContentContainer>
            <div className={style.tabs}>
                <button
                    className={activeTab === 'friends' ? style.active : ''}
                    onClick={() => handleTabClick('friends')}
                >
                    Друзья
                </button>
                <button
                    className={activeTab === 'requests' ? style.active : ''}
                    onClick={() => handleTabClick('requests')}
                >
                    Заявки в друзья
                </button>
                <button
                    className={activeTab === 'search' ? style.active : ''}
                    onClick={() => handleTabClick('search')}
                >
                    Поиск друзей
                </button>
            </div>

            {activeTab === 'friends' && (
                <>
                    <div className={style.friendsListContainer}>
                        {friends.length === 0 ? (
                            <div className={style.text}>У вас пока нет друзей</div>
                        ) : (
                            <ul>
                                {friends.map((profile) => (
                                    <li key={profile.id} onClick={() => handleClick(profile.id)} className={style.friendItem}>
                                        {profile.photoUrl && (
                                            <img
                                                src={profile.photoUrl}
                                                alt={`${profile.firstName} ${profile.lastName}`}
                                                className={style.friendPhoto}
                                            />
                                        )}
                                        <div className={style.friendInfo}>
                                            {profile.firstName} {profile.lastName}
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); toggleMenu(profile.id); }} className={style.menuButton}>
                                            <FontAwesomeIcon icon={faEllipsisV} />
                                        </button>

                                        {isMenuOpen === profile.id && (
                                            <div className={style.menu}>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteFriend(profile.id); }}>Удалить из друзей</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleViewProfile(profile.id); }}>Просмотр профиля</button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'requests' && (
                <FriendRequestComponent activeTab={activeTab} />
            )}

            {activeTab === 'search' && (
                <FriendsSearchComponent />
            )}
        </ContentContainer>
    );
};

export default FriendsListComponent;