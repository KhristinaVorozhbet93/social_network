import React, { useState, useEffect } from 'react';
import style from './UserProfileComponent.module.css';
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';
import UserPhotoAlbum from './UserPhotoAlbum';
import ContentContainer from '../ContentContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { parseISO, format, isValid } from 'date-fns';
import { ru } from 'date-fns/locale';

function UserProfileComponent() {
    const
        [profile, setProfile] = useState(null),
        [loading, setLoading] = useState(true),
        [isMenuOpen, setIsMenuOpen] = useState(false),
        [friends, setFriends] = useState([]),
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const profileId = localStorage.getItem('profileId');
                const data = await accountApi.getUserProfileById(profileId);
                const response = await accountApi.getFriends(profileId);
                setFriends(response);
                setProfile(data);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    function formatDate(dateString) {
        const parsedDate = parseISO(dateString);

        if (!isValid(parsedDate)) {
            console.error(`Invalid date string: ${dateString}`);
            return "Invalid Date";
        }

        return format(parsedDate, 'dd.MM.yyyy', { locale: ru });
    }

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEditClick = () => {
        navigate("/profile/user/update");
    };

    const handleDeleteClick = () => {
        navigate("/profile/user/update");
    };

    const navigateToGallery = () => {
        navigate(`/profile/user/${profileId}/photos`);
    };

    const navigateToFriends = () => {
        navigate('/friends');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ContentContainer>
            <div className={style.formContent}>
                <section>
                    <h2 className={style.galleryHeading}>Профиль</h2>
                    <div className={style.profileContainer}>
                        <div className={style.profilePhotoAndInfo}>
                            <img
                                src={profile.photoUrl}
                                alt="User Profile"
                                className={style.profilePhoto}
                            />

                            <div className={style.profileInfo}>
                                <div className={style.profileInfoRow}>
                                    <span>Имя:</span> <span>{profile.firstName}</span>
                                </div>
                                <div className={style.profileInfoRow}>
                                    <span>Фамилия:</span> <span>{profile.lastName}</span>
                                </div>
                                {profile.dateOfBirth && (
                                    <div className={style.profileInfoRow}>
                                        <span>Дата рождения:</span> <span>{formatDate(profile.dateOfBirth)}</span>
                                    </div>
                                )}
                                {/* {profile.walksDogs !== null && (
                                    <div className={style.profileInfoRow}>
                                        <span>Гуляет с собаками:</span> <span>{profile.walksDogs ? 'Да' : 'Нет'}</span>
                                    </div>
                                )} */}
                                {profile.profession && (
                                    <div className={style.profileInfoRow}>
                                        <span>Профессия:</span> <span>{profile.profession}</span>
                                    </div>
                                )}
                                {profile.aboutSelf && (
                                    <div className={style.profileInfoRow}>
                                        <span>О себе:</span> <p>{profile.aboutSelf}</p>
                                    </div>
                                )}
                                {profile.interests && (
                                    <div className={style.profileInfoRow}>
                                        <span>Интересы:</span> <p>{profile.interests}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={style.menuContainer}>
                            <FontAwesomeIcon
                                icon={faEllipsisV}
                                onClick={handleMenuClick}
                                className={style.menuIcon}
                            />
                            {isMenuOpen && (
                                <div className={style.menuDropdown}>
                                    <button onClick={handleEditClick}>Редактировать</button>
                                    <button onClick={handleDeleteClick}>Удалить</button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className={style.gallerySection}>
                    <div className={style.headerContainer}>
                        <h2 className={style.galleryHeading} onClick={() => navigateToGallery()}>Галерея</h2>
                        <div className={style.buttonContainer}>
                            <button onClick={() => navigateToGallery()} className={style.viewAllButton}>
                                Просмотр галереи
                            </button>
                        </div>
                    </div>
                    <UserPhotoAlbum id={profile.id} />
                </section>

                <section>
                    <div className={style.headerContainer}>
                        <h2 className={style.galleryHeading} onClick={() => navigateToFriends()}>Друзья</h2>
                        <div className={style.buttonContainer}>
                            <button onClick={() => navigateToFriends()} className={style.viewAllButton}>
                                Просмотр друзей
                            </button>
                        </div>
                    </div>
                    <div className={style.friendsListContainer}>
                        {friends.length === 0 ? (
                            <div className={style.noPhotosContainer}>
                                <div className={style.noPhotosText}>У вас пока нет друзей</div>
                            </div>
                        ) : (
                            <ul className={style.friendsList}>
                                {friends.slice(0, 6).map((friend, index) => (
                                    <li key={friend.id} onClick={() => navigateToFriends()} className={style.friendItem}>
                                        {friend.photoUrl && (
                                            <img
                                                src={friend.photoUrl}
                                                alt={`${friend.firstName} ${friend.lastName}`}
                                                className={style.friendPhoto}
                                                style={{ width: `${100 - index * 10}%`, height: `${100 - index * 10}%` }}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </ContentContainer>
    );
}

export default UserProfileComponent;