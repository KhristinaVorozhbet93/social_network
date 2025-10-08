import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import style from './FriendsComponent.module.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountApi } from "../../App";

function FriendsListComponent({ activeTab }) {
    const
        [friends, setFriends] = useState([]),
        [loading, setLoading] = useState(true),
        [hasMore, setHasMore] = useState(true),
        [offset, setOffset] = useState(0),
        [isMenuOpen, setIsMenuOpen] = useState(false),
        take = 100,
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        containerRef = useRef(null),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        setFriends([]);
        setOffset(0);
        setHasMore(true);
        fetchFriends();

    }, [activeTab]);

    const fetchFriends = useCallback(async () => {
        // if (loading || !hasMore) return; // Предотвращаем множественные запросы и загрузку, когда данных больше нет
        // setLoading(true);

        try {
            const profileId = localStorage.getItem('profileId');
            const response = await accountApi.getFriends(profileId, take, offset);

            if (response.length > 0) {
                setFriends(prevFriends => [...prevFriends, ...response]);
                setOffset(prevOffset => prevOffset + take);
            } else {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    }, [take, offset, loading, hasMore]);

    useEffect(() => {
        const container = containerRef.current;

        const handleScroll = () => {
            if (!container) return;

            const scrollHeight = container.scrollHeight;
            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;

            if (scrollHeight - scrollTop <= clientHeight + 20 && hasMore && !loading) {
                fetchFriends();
            }
        };

        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [fetchFriends, hasMore, loading]);

    const handleDeleteFriend = async (id) => {
        await accountApi.removeFriend(profileId, id);
        const response = await accountApi.getFriends(profileId);
        setFriends(response);
    };

    const handleViewProfile = (id) => {
        navigate(`/profile/user/${id}`);
    };

    const toggleMenu = (profileId) => {
        setIsMenuOpen(isMenuOpen === profileId ? null : profileId);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    const handleClick = (id) => {
        navigate(`/profile/user/${id}`);
    }

    return (
        <div className={style.friendsListContainer} ref={containerRef}>
            {friends.length === 0 && !loading ? (
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
                    {loading && <li>Загрузка...</li>}
                </ul>
            )}
        </div>
    );
}

export default FriendsListComponent;