import { useEffect, useState } from "react";
import ContentContainer from "../ContentContainer";
import style from '../Friends/FriendsListComponent.module.css';
import { useAccountApi } from "../../App";
import { useNavigate, useParams } from "react-router-dom";

function UserFrinedListViewComponent() {
    const
        [friends, setFriends] = useState([]),
        [loading, setLoading] = useState(true),
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        { id } = useParams();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await accountApi.getFriends(id);
                setFriends(response);

            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);

    const handleClick = (id) => {
        navigate(`/profile/user/${id}`);
    }

    return (
        <ContentContainer>
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
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
        </ContentContainer>
    );
}
export default UserFrinedListViewComponent;