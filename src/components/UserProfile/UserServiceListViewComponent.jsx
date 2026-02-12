import { useEffect, useState } from "react";
import ContentContainer from "../Layout/ContentContainer";
import style from './UserServiceListViewComponent.module.css';
import { useAccountApi } from "../../App";
import { useNavigate, useParams } from "react-router-dom";

function UserServiceListViewComponent() {
    const
        [services, setServices] = useState([]),
        [loading, setLoading] = useState(true),
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        { id } = useParams();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await accountApi.getServices(id);
                setServices(response);

            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);


    const handleClick = (id) => {
        navigate(`/profile/service/${id}`);
    }

    return (
        <ContentContainer>
            {services.length === 0 ? (
                <div className={style.servicesListContainer}>
                    <div className={style.noServicesText}>Нет услуг</div>
                </div>
            ) : (
                <ul>
                    {services.map((service) => (
                        <li key={service.id} onClick={() => handleClick(service.id)} className={style.serviceItem}>
                            {service.photoUrl && (
                                <img
                                    src={service.photoUrl}
                                    alt={service.serviceType?.name || "Услуга"}
                                    className={style.servicePhoto}
                                />
                            )}
                            <div className={style.serviceInfo}>
                                {service.serviceType?.name || "Без названия"}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </ContentContainer>
    );
}
export default UserServiceListViewComponent;