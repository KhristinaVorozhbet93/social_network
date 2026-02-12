import React, { useEffect, useState } from 'react';
import style from './ServiceComponent.module.css';
import { useAccountApi } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import ContentContainer from '../Layout/ContentContainer';
import ServiceFactory, { FactoryType } from '../ServiceFactory';

function ServiceViewComponent() {
    const
        [services, setServices] = useState([]),
        [activeServiceIndex, setActiveServiceIndex] = useState(0),
        [loading, setLoading] = useState(false),
        navigate = useNavigate(),
        { id } = useParams(),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {
                const service = await accountApi.getServiceById(id);
                const data = await accountApi.getServices(service.profileId);
                if (data && data.length > 0) {
                    setServices(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    const handleTabClick = (index) => {
        setActiveServiceIndex(index);
    };

    const handleAddTab = () => {
        navigate('/service/create');
    };

    if (!services || services.length === 0) {
        return (
            <ContentContainer>
                <div className={style.addProfile}>
                    <div>Нет услуг</div>
                </div>
            </ContentContainer>
        );
    }

    const currentService = services[activeServiceIndex];

    return (
        <ContentContainer>
            <div className={style.tabs}>
                {services.map((service, index) => (
                    <div
                        key={service.id}
                        className={`${style.tab} ${index === activeServiceIndex ? style.activeTab : ''}`}
                        onClick={() => {
                            handleTabClick(index);
                            setActiveServiceIndex(index);
                        }}
                    >
                        {service.serviceType.name}
                        {service.type && <span className={style.serviceTypeBadge}>{service.type}</span>}
                    </div>
                ))}
                <div className={style.tab_disable}></div>
            </div>

            <section>
                <div className={style.profilePhotoAndInfo}>
                    {currentService && (
                        <>
                            <ServiceFactory factoryType={FactoryType.VIEW} service={currentService} />
                        </>
                    )}
                </div>
            </section>
        </ContentContainer>
    );
}

export default ServiceViewComponent;