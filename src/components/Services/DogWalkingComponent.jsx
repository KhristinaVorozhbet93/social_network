import { useState, useEffect } from 'react';
import style from './DogWalkingComponent.module.css';
import { useAccountApi } from '../../App';
import { CircularProgress, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faInfoCircle, faCalendarAlt, faClock, faHourglass, faDog } from '@fortawesome/free-solid-svg-icons';
import DogWalkingBookingComponent from './DogWalkingBookingComponent';
import { useNavigate } from 'react-router-dom';

function DogWalkingComponent({ service }) {
    const
        [dogWalkingDetails, setDogWalkingDetails] = useState(null),
        [availableSlots, setAvailableSlots] = useState([]),
        [slotsLoading, setSlotsLoading] = useState(false),
        [loading, setLoading] = useState(false),
        [deleting, setDeleting] = useState(false),
        [activeTab, setActiveTab] = useState(0),
        [isMenuOpen, setIsMenuOpen] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        accountApi = useAccountApi(),
        navigate = useNavigate(),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchDogWalkingDetails = async () => {
            if (!service.id) return;

            setLoading(true);
            try {
                const data = await accountApi.getDogWalkingService(service.id);
                setDogWalkingDetails(data);
            } finally {
                setLoading(false);
            }
        };

        fetchDogWalkingDetails();
    }, [service.id, accountApi]);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!service.id) return;

            setSlotsLoading(true);
            try {
                const slots = await accountApi.getAvailableSlots(service.id);
                setAvailableSlots(slots || []);
            } finally {
                setSlotsLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [service.id, accountApi]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEditClick = () => {
        setIsMenuOpen(false);
        navigate(`/service/${service.id}/update`);
    };

    const handleDeleteClick = async () => {
        setDeleting(true);
        try {
            await accountApi.deleteService(service.id);

            setSnackbarSeverity('success');
            setSnackbarMessage('Услуга успешно удалена');
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate('/services');
            }, 2000);
        } finally {
            setDeleting(false);
            setIsMenuOpen(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const formatDate = (slotDateTime) => {
        try {
            const date = new Date(slotDateTime);
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long'
            });
        } catch (error) {
            return slotDateTime;
        }
    };

    const formatTime = (slotDateTime) => {
        try {
            const date = new Date(slotDateTime);
            return date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return slotDateTime;
        }
    };

    const groupSlotsByDate = () => {
        const grouped = {};
        
        availableSlots
            .filter(slot => slot.isAvailable)
            .sort((a, b) => new Date(a.slotDateTime) - new Date(b.slotDateTime))
            .forEach(slot => {
                const date = new Date(slot.slotDateTime);
                const dateKey = date.toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                });

                if (!grouped[dateKey]) {
                    grouped[dateKey] = {
                        date: slot.slotDateTime,
                        slots: []
                    };
                }

                grouped[dateKey].slots.push(slot);
            });

        return grouped;
    };

    const isServiceEmpty = !service.description &&
        !service.price &&
        (!dogWalkingDetails ||
            (!dogWalkingDetails.maxDogs && !dogWalkingDetails.walkDurationMinutes));

    if (loading) {
        return (
            <div className={style.serviceCard}>
                <div className={style.loadingContainer}>
                    <CircularProgress />
                    <div className={style.loadingText}>Загрузка данных...</div>
                </div>
            </div>
        );
    }

    const groupedSlots = groupSlotsByDate();
    const hasAvailableSlots = availableSlots.filter(s => s.isAvailable).length > 0;

    return (
        <div className={style.serviceCard}>
            <div className={style.serviceTabs}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    className={style.tabs}
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: '#F57C00',
                            height: '3px'
                        }
                    }}
                >
                    <Tab
                        label={
                            <div className={style.tabContent}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <span className={style.tabLabel}>Информация об услуге</span>
                            </div>
                        }
                    />
                    <Tab
                        label={
                            <div className={style.tabContent}>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className={style.tabLabel}>Бронирования услуги</span>
                            </div>
                        }
                        disabled={!profileId}
                    />
                </Tabs>
            </div>

            <div className={style.tabPanels}>
                {activeTab === 0 && (
                    <div className={style.tabPanel}>
                        <div className={style.serviceHeaderContainer}>
                            <div className={style.headerContent}>
                                <h2 className={style.serviceTitle}>🐕 {service.serviceType?.name || 'Выгул собак'}</h2>
                                {service.price && (
                                    <div className={style.servicePrice}>
                                        {service.price.toLocaleString('ru-RU')} ₽
                                    </div>
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
                                        <button onClick={handleEditClick}>Редактировать</button>
                                        <button
                                            onClick={handleDeleteClick}
                                            disabled={deleting}
                                        >
                                            {deleting ? (
                                                <CircularProgress size={16} color="inherit" />
                                            ) : 'Удалить'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={style.infoContent}>
                            {isServiceEmpty ? (
                                <div className={style.emptyService}>
                                    <div className={style.emptyIcon}>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                    </div>
                                    <div className={style.emptyMessage}>
                                        Услуга не заполнена.
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {service.description && (
                                        <div className={style.serviceDescription}>
                                            <h3 className={style.sectionTitle}>Описание</h3>
                                            <p>{service.description}</p>
                                        </div>
                                    )}

                                    {dogWalkingDetails && (
                                        <div className={style.serviceDetails}>
                                            <h3 className={style.sectionTitle}>Параметры выгула</h3>
                                            <div className={style.detailsGrid}>
                                                {dogWalkingDetails.maxDogs && (
                                                    <div className={style.detailItem}>
                                                        <span className={style.detailLabel}>
                                                            <FontAwesomeIcon icon={faDog} />
                                                            Максимум собак:
                                                        </span>
                                                        <span className={style.detailValue}>
                                                            {dogWalkingDetails.maxDogs} шт.
                                                        </span>
                                                    </div>
                                                )}

                                                {dogWalkingDetails.walkDurationMinutes && (
                                                    <div className={style.detailItem}>
                                                        <span className={style.detailLabel}>
                                                            <FontAwesomeIcon icon={faHourglass} />
                                                            Длительность прогулки:
                                                        </span>
                                                        <span className={style.detailValue}>
                                                            {dogWalkingDetails.walkDurationMinutes} мин.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className={style.slotsSection}>
                                        <h3 className={style.sectionTitle}>
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            Доступное время для выгула
                                        </h3>

                                        {slotsLoading ? (
                                            <div className={style.slotsLoading}>
                                                <CircularProgress size={24} />
                                                <span>Загрузка слотов...</span>
                                            </div>
                                        ) : !hasAvailableSlots ? (
                                            <div className={style.noSlots}>
                                                <div className={style.noSlotsIcon}>
                                                    <FontAwesomeIcon icon={faClock} />
                                                </div>
                                                <div className={style.noSlotsMessage}>
                                                    Нет доступного времени для выгула
                                                </div>
                                                <div className={style.noSlotsHint}>
                                                    Время для выгула пока не добавлено
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={style.slotsList}>
                                                {Object.keys(groupedSlots).map(dateKey => (
                                                    <div key={dateKey} className={style.slotDateGroup}>
                                                        <div className={style.slotDateHeader}>
                                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                                            {formatDate(groupedSlots[dateKey].date)}
                                                        </div>
                                                        <div className={style.slotTimeGrid}>
                                                            {groupedSlots[dateKey].slots.map(slot => (
                                                                <div key={slot.id} className={style.slotTimeCard}>
                                                                    <div className={style.slotTime}>
                                                                        <FontAwesomeIcon icon={faClock} />
                                                                        {formatTime(slot.slotDateTime)}
                                                                    </div>
                                                                    {slot.walkDurationMinutes && (
                                                                        <div className={style.slotDuration}>
                                                                            {slot.walkDurationMinutes} мин
                                                                        </div>
                                                                    )}
                                                                    <div className={style.slotStatus}>
                                                                        Свободно
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 1 && (
                    <div className={style.tabPanel}>
                        <DogWalkingBookingComponent
                            service={service}
                            profileId={profileId}
                        />
                    </div>
                )}
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default DogWalkingComponent;