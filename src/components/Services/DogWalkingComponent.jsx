import { useState, useEffect } from 'react';
import style from './DogWalkingComponent.module.css';
import { useAccountApi } from '../../App';

function DogWalkingComponent({ service }) {
    const
        [dogWalkingDetails, setDogWalkingDetails] = useState(null),
        [loading, setLoading] = useState(false),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchDogWalkingDetails = async () => {
            if (!service.id) return;

            console.log(service.price)
            setLoading(true);
            try {
                const data = await accountApi.getDogWalkingService(service.id);
                setDogWalkingDetails(data);
            } finally {
                setLoading(false);
            }
        };

        fetchDogWalkingDetails();
    }, [service.id]);

    const isServiceEmpty = !service.description && 
                          !service.price && 
                          (!dogWalkingDetails || 
                           (!dogWalkingDetails.maxDogs && !dogWalkingDetails.walkDurationMinutes));

    if (loading) {
        return (
            <div className={style.serviceCard}>
                <div className={style.loading}>Загрузка данных...</div>
            </div>
        );
    }

    return (
        <div className={style.serviceCard}>
            <div className={style.serviceHeader}>
                <h2 className={style.serviceTitle}>🐕 {service.serviceType?.name || 'Выгул собак'}</h2>
                {service.price && (
                    <div className={style.servicePrice}>
                        {service.price.toLocaleString('ru-RU')} ₽
                    </div>
                )}
            </div>

            {isServiceEmpty ? (
                <div className={style.emptyService}>
                    <div className={style.emptyIcon}>ℹ️</div>
                    <div className={style.emptyMessage}>
                        Услуга не заполнена. Добавьте описание, цену и параметры выгула.
                    </div>
                </div>
            ) : (
                <>
                    {service.description && (
                        <div className={style.serviceDescription}>
                            <p>{service.description}</p>
                        </div>
                    )}

                    {dogWalkingDetails && (
                        <div className={style.serviceDetails}>
                            <div className={style.detailsGrid}>
                                {dogWalkingDetails.maxDogs && (
                                    <div className={style.detailItem}>
                                        <span className={style.detailLabel}>Максимум собак:</span>
                                        <span className={style.detailValue}>
                                            {dogWalkingDetails.maxDogs} шт.
                                        </span>
                                    </div>
                                )}

                                {dogWalkingDetails.walkDurationMinutes && (
                                    <div className={style.detailItem}>
                                        <span className={style.detailLabel}>Длительность прогулки:</span>
                                        <span className={style.detailValue}>
                                            {dogWalkingDetails.walkDurationMinutes} мин.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default DogWalkingComponent;