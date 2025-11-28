import React, { useEffect, useState } from 'react';
import { useAccountApi } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import ContentContainer from '../Layout/ContentContainer';
import style from './ServiceUpdateComponent.module.css';
import DogWalkingUpdateComponent from './DogWalkingUpdateComponent';

function ServiceUpdateComponent() {
    const
        [service, setService] = useState(null),
        [selectedServiceTypeId, setSelectedServiceTypeId] = useState(''),
        [isLoading, setLoading] = useState(false),
        accountApi = useAccountApi(),
        { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (id) {
                    const serviceData = await accountApi.getServiceById(id);
                    setService(serviceData);
                    setSelectedServiceTypeId(serviceData.serviceTypeId);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accountApi, id]);

    //переделать метод - вынести куда-то маппинг отсюда
    const renderSpecificForm = () => {
        const SERVICE_TYPE_MAPPING = {
            'a3d4e5f6-7890-1234-5678-9abcdef01234': 'dogWalking',
        };
        const serviceType = SERVICE_TYPE_MAPPING[selectedServiceTypeId];

        switch (serviceType) {
            case 'dogWalking':
                return <DogWalkingUpdateComponent serviceId={id} />;
        }
    };

    if (!service && !isLoading) {
        return (
            <ContentContainer>
                <div className={style.errorMessage}>Услуга не найдена</div>
            </ContentContainer>
        );
    }

    return (
        <ContentContainer>
            <h2>Редактирование услуги</h2>
            {renderSpecificForm()}
        </ContentContainer>
    );
}

export default ServiceUpdateComponent;