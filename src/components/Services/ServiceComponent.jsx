import React, { useEffect, useState } from 'react';
import style from './ServiceComponent.module.css';
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';
import ContentContainer from '../Layout/ContentContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import ServiceFactory from '../ServiceFactory';

function ServiceComponent() {
    const
        [services, setServices] = useState([]),
        [activeServiceIndex, setActiveServiceIndex] = useState(0),
        [loading, setLoading] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        [isMenuOpen, setIsMenuOpen] = useState(false),
        [accountId, setAccountId] = useState([]),
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {
                setAccountId(accountId);
                const data = await accountApi.getServices(profileId);
                if (data && data.length > 0) {
                    setServices(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    const handleDeleteProfile = async (id, index) => {
        setLoading(true);
        try {
            await accountApi.deleteService(id);
            setSnackbarSeverity('success');
            setSnackbarMessage('Услуга успешно удалена');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/services');
            }, 3000);

            const newServices = [...services];
            newServices.splice(index, 1);
            setServices(newServices);
            if (activeServiceIndex >= newServices.length) {
                setActiveServiceIndex(newServices.length - 1);
            }
        }
        finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleTabClick = (index) => {
        setActiveServiceIndex(index);
    };

    const handleAddTab = () => {
        navigate('/service/create');
    };

    const handleEditClick = (profile) => {
        navigate(`/service/${profile.id}/update`);
    };

    if (!services || services.length === 0) {
        return (
            <ContentContainer>
                <div className={style.addProfile}>
                    <div>Нет услуг</div>
                    <button onClick={handleAddTab}>Добавить</button>
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
                <div className={style.tab} onClick={handleAddTab}>+</div>
            </div>

            <div className={style.tabContent}>
                <div className={style.formContent}>
                    <section>
                        <div className={style.profileContainer}>
                            <div className={style.profilePhotoAndInfo}>
                                {currentService && (
                                    <>
                                        <ServiceFactory service={currentService} />
                                    </>
                                )}
                            </div>

                            <div className={style.menuContainer}>
                                <FontAwesomeIcon
                                    icon={faEllipsisV}
                                    onClick={handleMenuClick}
                                    className={style.menuIcon}
                                />
                                {isMenuOpen && (
                                    <div className={style.menuDropdown}>
                                        <button onClick={() => handleEditClick(currentService)}>Редактировать</button>
                                        <button onClick={() => handleDeleteProfile(currentService.id, activeServiceIndex)} disabled={loading}>
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Удалить'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                className={style.snackbar}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </ContentContainer>
    );
}

export default ServiceComponent;