import React, { useState, useEffect } from 'react';
import style from './UserProfileComponent.module.css';
import HeaderComponent from "../HeaderComponent";
import AsideComponent from "../AsideComponent";
import FooterComponent from "../FooterComponent";
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';

function UserProfileComponent() {
    const
        [profile, setProfile] = useState(null),
        [loading, setLoading] = useState(true),
        navigate = useNavigate(),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const profileId = localStorage.getItem('profileId');          
                const data = await accountApi.getUserProfileById(profileId);
                setProfile(data);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);


    const handleEditClick = () => {
        navigate("/profile/user/update");
    };

   
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={style.container}>
            <HeaderComponent />
            <div className={style.content}>
                <AsideComponent />
                <div className={style.main_content}>
                    <div className={style.formContent} >
                        {profile.photo && <img src={profile.photo} alt="User Profile" style={{ maxWidth: '100px' }} />}
                        <p>Имя: {profile.firstName}</p>
                        <p>Фамилия: {profile.lastName}</p>
                        <p>Дата рождения: {profile.dateOfBirth?.split('T')[0]}</p>
                        <p>Гуляет с собаками: {profile.walksDogs ? 'Да' : 'Нет'}</p>
                        <p>Профессия: {profile.profession}</p>
                        <button onClick={handleEditClick}>Редактировать</button>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default UserProfileComponent;