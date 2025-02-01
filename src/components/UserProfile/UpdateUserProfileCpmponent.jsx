import { useState, useEffect} from "react";
import { useAccountApi } from "../../App";
import { useNavigate } from "react-router-dom";
import style from './UserProfileComponent.module.css';
import HeaderComponent from "../HeaderComponent";
import AsideComponent from "../AsideComponent";
import FooterComponent from "../FooterComponent";

function UpdateUserProfileComponent() {
    const 
    [firstName, setFirstName] = useState(''),
    [lastName, setLastName] = useState(''),
    [dateOfBirth, setDateOfBirth] = useState(''),
    [walksDogs, setWalksDogs] = useState(false),
    [profession, setProfession] = useState(''),
    [loading, setLoading] = useState(false),
    [profile, setProfile] = useState(false),
    accountApi = useAccountApi(),
    navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const accountId = localStorage.getItem('accountId');
                const data = await accountApi.getUserProfile(accountId);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setDateOfBirth(data.dateOfBirth?.split('T')[0] || '');
                setWalksDogs(data.walksDogs);
                setProfession(data.profession);
                setProfile(data);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const accountId = localStorage.getItem('accountId');

            const profileData = {
                Id: profile.id,
                AccountId: accountId,
                FirstName: firstName,
                LastName: lastName,
                DateOfBirth:  dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
                WalksDogs: walksDogs,
                Profession: profession
            };

            await accountApi.updateUserProfile(profileData);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        navigate("/profile/user");
    };

    return (
        <div className={style.container}>
            <HeaderComponent />
            <div className={style.content}>
                <AsideComponent />
                <div className={style.main_content}>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Имя:</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div>
                            <label>Фамилия:</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                        <div>
                            <label>День рожденья:</label>
                            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                        </div>
                        <div>
                            <label>Выгул собак:</label>
                            <input type="checkbox" checked={walksDogs} onChange={(e) => setWalksDogs(e.target.checked)} />
                        </div>
                        <div>
                            <label>Профессия:</label>
                            <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Загрузка...' : 'Сохранить'}
                        </button>
                        <button type="button" onClick={handleCancelEdit} disabled={loading}>
                            Отмена
                        </button>
                    </form>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default UpdateUserProfileComponent;