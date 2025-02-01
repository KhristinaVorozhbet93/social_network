import style from './UserProfileComponent.module.css';
import HeaderComponent from "../HeaderComponent";
import AsideComponent from "../AsideComponent";
import FooterComponent from "../FooterComponent";
import { useAccountApi } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ViewProfileComponent() {
    const
        [profile, setProfile] = useState(false),
        [loading, setLoading] = useState(false),
        [isFriend, setIsFriend] = useState(false),
        { id } = useParams(),
        accountApi = useAccountApi(),
        navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await accountApi.getUserProfileById(id);
                setProfile(data);

                //проверить в друзьях пользователь или нет
                const checkFriend = await accountApi.isFriend(id);
                setIsFriend(checkFriend);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, accountApi]);

    const handleAddFriend = async () => {
        const profileId = localStorage.getItem('profileId');          
        await accountApi.sendRequestToFriend(profileId, id);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!profile) {
        return <div>Пользователь не найден.</div>;
    }

    return (
        <div className={style.container}>
            <HeaderComponent />
            <div className={style.content}>
                <AsideComponent />
                <div className={style.main_content}>
                    <div className={style.formContent}>
                        {profile.photo && <img src={profile.photo} alt="User Profile" style={{ maxWidth: '100px' }} />}
                        <p>Имя: {profile.firstName}</p>
                        <p>Фамилия: {profile.lastName}</p>
                        <p>Дата рождения: {profile.dateOfBirth?.split('T')[0]}</p>
                        <p>Гуляет с собаками: {profile.walksDogs ? 'Да' : 'Нет'}</p>
                        <p>Профессия: {profile.profession}</p>
                        {!isFriend && (
                            <button onClick={handleAddFriend}>Добавить в друзья</button>
                        )}
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default ViewProfileComponent;