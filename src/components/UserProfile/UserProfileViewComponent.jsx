import style from './UserProfileComponent.module.css';
import { useAccountApi } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserPhotoAlbum from './UserPhotoAlbum';
import ContentContainer from '../Layout/ContentContainer';
import { parseISO, format, isValid } from 'date-fns';
import { ru } from 'date-fns/locale';

function UserProfileViewComponent() {
    const
        [profile, setProfile] = useState([]),
        [isFriend, setIsFriend] = useState(false),
        [friends, setFriends] = useState([]),
        [hasReceivedRequest, setHasReceivedRequest] = useState(false),
        [hasSentRequest, setHasSentRequest] = useState([]),
        [loading, setLoading] = useState(true),
        [services, setServices] = useState([]),
        [requestSent, setRequestSent] = useState(false),
        [pets, setPets] = useState([]),
        { id } = useParams(),
        accountApi = useAccountApi(),
        navigate = useNavigate(),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const profileId = localStorage.getItem('profileId');
                const sent = await accountApi.getSentFriendRequests(profileId);
                const hasSentRequest = sent.some(request => request.id === id);
                setHasSentRequest(hasSentRequest);
                const data = await accountApi.getUserProfileById(id);
                setProfile(data);
                const response = await accountApi.getFriends(id);
                setFriends(response);
                const petResponse = await accountApi.getPetProfiles(id);
                if (petResponse && petResponse.length > 0) {
                    setPets(petResponse);
                }
                const isFriendCheck = response.some(friend => friend.id === profileId);
                setIsFriend(isFriendCheck);
                const hasRequest = await accountApi.hasSentRequest(profileId, id);
                setHasReceivedRequest(hasRequest);
                const services = await accountApi.getServices(id);
                setServices(services);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, accountApi]);

    function formatDate(dateString) {
        const parsedDate = parseISO(dateString);

        if (!isValid(parsedDate)) {
            console.error(`Invalid date string: ${dateString}`);
            return "Invalid Date";
        }

        return format(parsedDate, 'dd.MM.yyyy', { locale: ru });
    }

    const handleAddFriend = async () => {
        await accountApi.sendRequestToFriend(profileId, id);
        setRequestSent(true);
        setHasSentRequest(true);
    };

    const handleRemoveFriend = async () => {
        await accountApi.removeFriend(profileId, id);
        setIsFriend(false);
    };

    const handleAcceptRequest = async () => {
        await accountApi.acceptFriendRequest(profileId, id);
        setIsFriend(true);
        setHasReceivedRequest(false);
    };

    const handleSendMessage = async () => {
        const friendIds = [profileId, id];
        const data = await accountApi.getOrCreateChat(friendIds);
        navigate(`/chat/${data.id}`);
    };

    const navigateToPets = () => {
        navigate(`/profile/user/${id}/pets`);
    };

    const navigateToGallery = () => {
        navigate(`/profile/user/${id}/photos`);
    };

    const navigateToFriends = () => {
        navigate(`/profile/user/${id}/friends`);
    };

    const navigateToServices = () => {
        navigate(`/profile/user/${id}/services`);
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
                                <p>Имя: {profile.firstName}</p>
                                <p>Фамилия: {profile.lastName}</p>
                                {profile.dateOfBirth && (
                                    <p>Дата рождения: {formatDate(profile.dateOfBirth)}</p>
                                )}
                                {profile.walksDogs !== null && (
                                    <p>Гуляет с собаками: {profile.walksDogs ? 'Да' : 'Нет'}</p>
                                )}
                                {profile.profession && (
                                    <p>Профессия: {profile.profession}</p>
                                )}
                                {profile.aboutSelf && (
                                    <p>О себе: {profile.aboutSelf}</p>
                                )}
                                {profile.interests && (
                                    <p>Интересы: {profile.interests}</p>
                                )}
                            </div>

                        </div>
                    </div>
                </section>

                <div className={style.group_buttons}>
                    <button onClick={handleSendMessage} className={style.viewAllButton}>Написать сообщение</button>
                    {isFriend ? (
                        <button onClick={handleRemoveFriend} className={style.viewAllButton}>Удалить из друзей</button>
                    ) : hasReceivedRequest ? (
                        <button onClick={handleAcceptRequest} className={style.viewAllButton}>Принять заявку</button>
                    ) : (
                        hasSentRequest ? (
                            <div>Заявка отправлена</div>
                        ) : (
                            <button onClick={handleAddFriend} className={style.viewAllButton}>Добавить в друзья</button>
                        )
                    )}
                </div>

                <section className={style.gallerySection}>
                    <div className={style.headerContainer}>
                        <h2 className={style.galleryHeading} onClick={() => navigateToGallery()}>Галерея</h2>
                        <div className={style.buttonContainer}>
                            <button onClick={() => navigateToGallery()} className={style.viewAllButton}>
                                Просмотр галереи
                            </button>
                        </div>
                    </div>
                    <UserPhotoAlbum id={id} />
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
                                <div className={style.noPhotosText}>У пользователя нет друзей</div>
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


                <section className={style.gallerySection}>
                    <div className={style.headerContainer}>
                        <h2 className={style.galleryHeading} onClick={() => navigateToPets()}>Питомцы</h2>
                        <div className={style.buttonContainer}>
                            <button onClick={() => navigateToPets()} className={style.viewAllButton}>
                                Просмотр питомцев
                            </button>
                        </div>
                    </div>
                    <div className={style.friendsListContainer}>
                        {pets.length === 0 ? (
                            <div className={style.noPhotosContainer}>
                                <div className={style.noPhotosText}>У пользователя нет питомцев</div>
                            </div>
                        ) : (
                            <ul className={style.friendsList}>
                                {pets.slice(0, 6).map((pet, index) => (
                                    <li key={pet.id} onClick={() => navigateToPets()} className={style.friendItem}>
                                        {pet.photoUrl && (
                                            <img
                                                src={pet.photoUrl}
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

                <section>
                    <div className={style.headerContainer}>
                        <h2 className={style.galleryHeading} onClick={() => navigateToServices()}>Услуги</h2>
                        <div className={style.buttonContainer}>
                            <button onClick={() => navigateToServices()} className={style.viewAllButton}>
                                Просмотр услуг
                            </button>
                        </div>
                    </div>

                    <div className={style.friendsListContainer}>
                        {services.length === 0 ? (
                            <div className={style.noPhotosContainer}>
                                <div className={style.noPhotosText}>Пользователь не предоставляет услуг.</div>
                            </div>
                        ) : (
                            <ul className={style.friendsList}>
                                {services.slice(0, 6).map((services, index) => (
                                    <li key={services.id} onClick={() => navigateToServices()} className={style.friendItem}>
                                        {services.photoUrl && (
                                            <img
                                                src={services.photoUrl}
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

export default UserProfileViewComponent;