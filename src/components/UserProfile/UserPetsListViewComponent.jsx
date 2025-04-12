import { useEffect, useState } from "react";
import ContentContainer from "../ContentContainer";
import style from '../Friends/FriendsListComponent.module.css';
import { useAccountApi } from "../../App";
import { useNavigate, useParams } from "react-router-dom";

function UserPetsistViewComponent() {
    const
        [pets, setPets] = useState([]),
        [loading, setLoading] = useState(true),
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        { id } = useParams();

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {
                const data = await accountApi.getPetProfiles(id);
                if (data && data.length > 0) {
                    setPets(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    const handleClick = (id) => {
        navigate(`/profile/pet/${id}`);
    }

    return (
        <ContentContainer>
            <div className={style.friendsListContainer}>
                {pets.length === 0 ? (
                     <div className={style.text}>У пользователя нет питомцев</div>
                ) : (
                    <ul>
                        {pets.map((profile) => (
                            <li key={profile.id} onClick={() => handleClick(profile.id)} className={style.friendItem}>
                                {profile.photoUrl && (
                                    <img
                                        src={profile.photoUrl}
                                        alt={profile.name}
                                        className={style.friendPhoto}
                                    />
                                )}
                                
                                <div className={style.friendInfo}>
                                    {profile.name}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </ContentContainer>
    );
}
export default UserPetsistViewComponent;