import { useState, useEffect } from 'react';
import style from './DogWalkingViewComponent.module.css';
import { useAccountApi } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faClock,
    faCheck,
    faTimes,
    faDog,
    faHourglass,
    faMapMarkerAlt,
    faMoneyBillWave,
    faMapPin
} from '@fortawesome/free-solid-svg-icons';
import { Alert, Snackbar } from '@mui/material';

function DogWalkingViewComponent({ service }) {
    const
        [dogWalkingDetails, setDogWalkingDetails] = useState(null),
        [availableSlots, setAvailableSlots] = useState([]),
        [loading, setLoading] = useState(false),
        [bookingLoading, setBookingLoading] = useState(false),
        [selectedSlot, setSelectedSlot] = useState(null),
        [bookingAddress, setBookingAddress] = useState(''),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        profileId = localStorage.getItem('profileId'),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchServiceData = async () => {
            if (!service.id) return;

            setLoading(true);
            try {
                const dogWalkingData = await accountApi.getDogWalkingService(service.id);
                setDogWalkingDetails(dogWalkingData);
                const slots = await accountApi.getAvailableSlots(service.id);
                setAvailableSlots(slots || []);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceData();
    }, [service.id, accountApi]);

    const formatDateTime = (slotDateTime) => {
        try {
            const date = new Date(slotDateTime);
            return date.toLocaleString('ru-RU', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Ошибка форматирования даты:', error);
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
            console.error('Ошибка форматирования времени:', error);
            return slotDateTime;
        }
    };

    const formatDate = (slotDateTime) => {
        try {
            const date = new Date(slotDateTime);
            return date.toLocaleDateString('ru-RU', {
                weekday: 'short',
                day: 'numeric',
                month: 'long'
            });
        } catch (error) {
            console.error('Ошибка форматирования даты:', error);
            return slotDateTime;
        }
    };

    const groupSlotsByDate = () => {
        const grouped = {};

        availableSlots.forEach(slot => {
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

    const handleSlotSelect = (slot) => {
        setSelectedSlot(selectedSlot?.id === slot.id ? null : slot);
    };

    const handleBookSlot = async () => {
        if (!selectedSlot) {
            setSnackbarSeverity('warning');
            setSnackbarMessage('Выберите слот для бронирования');
            setSnackbarOpen(true);
            return;
        }

        if (!bookingAddress.trim()) {
            setSnackbarSeverity('warning');
            setSnackbarMessage('Пожалуйста, укажите адрес для выгула собаки');
            setSnackbarOpen(true);
            return;
        }

        setBookingLoading(true);
        try {
            await accountApi.bookSlot(selectedSlot.id, service.id, profileId, bookingAddress);
            setSnackbarSeverity('success');
            setSnackbarMessage(`Вы успешно забронировали прогулку на ${formatDateTime(selectedSlot.slotDateTime)}!`);
            setSnackbarOpen(true);

            setAvailableSlots(prev => prev.filter(slot => slot.id !== selectedSlot.id));
            setSelectedSlot(null);
            setBookingAddress('');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const isServiceEmpty = !service.description &&
        !service.price &&
        (!dogWalkingDetails ||
            (!dogWalkingDetails.maxDogs && !dogWalkingDetails.walkDurationMinutes));

    if (loading) {
        return (
            <div className={style.serviceCard}>
                <div className={style.loadingContainer}>
                    <div className={style.spinner}></div>
                    <div className={style.loadingText}>Загрузка данных...</div>
                </div>
            </div>
        );
    }

    const groupedSlots = groupSlotsByDate();
    const hasAvailableSlots = availableSlots.length > 0;

    return (
        <div className={style.serviceCard}>
            <div className={style.serviceHeader}>
                <div className={style.serviceTitleContainer}>
                    <FontAwesomeIcon icon={faDog} className={style.serviceTitleIcon} />
                    <h2 className={style.serviceTitle}>{service.serviceType?.name || 'Выгул собак'}</h2>
                </div>
                {service.price && (
                    <div className={style.servicePrice}>
                        {service.price.toLocaleString('ru-RU')} ₽
                    </div>
                )}
            </div>

            {isServiceEmpty ? (
                <div className={style.noService}>
                    <div className={style.noServiceIcon}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <h3 className={style.noServiceTitle}>
                        Услуга не заполнена.
                    </h3>
                    <div className={style.noServiceHint}>
                        Исполнитель пока не добавил информацию об услуге
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
                                        <div className={style.detailLabel}>
                                            <FontAwesomeIcon icon={faDog} />
                                            <span>Максимум собак:</span>
                                        </div>
                                        <div className={style.detailValue}>
                                            {dogWalkingDetails.maxDogs} шт.
                                        </div>
                                    </div>
                                )}

                                {dogWalkingDetails.walkDurationMinutes && (
                                    <div className={style.detailItem}>
                                        <div className={style.detailLabel}>
                                            <FontAwesomeIcon icon={faHourglass} />
                                            <span>Длительность прогулки:</span>
                                        </div>
                                        <div className={style.detailValue}>
                                            {dogWalkingDetails.walkDurationMinutes} мин.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={style.slotsSection}>
                        <div className={style.slotsTitle}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>Доступное время для выгула</span>
                        </div>

                        {!hasAvailableSlots ? (
                            <div className={style.noSlots}>
                                <div className={style.noSlotsIcon}>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                </div>
                                <div className={style.noSlotsMessage}>
                                    Нет доступного времени для выгула
                                </div>
                                <div className={style.noSlotsHint}>
                                    Исполнитель пока не указал доступное время
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={style.dateGroups}>
                                    {Object.keys(groupedSlots).map(dateKey => (
                                        <div key={dateKey} className={style.dateGroup}>
                                            <div className={style.dateHeader}>
                                                {formatDate(groupedSlots[dateKey].date)}
                                            </div>
                                            <div className={style.timeSlots}>
                                                {groupedSlots[dateKey].slots.map(slot => (
                                                    <div
                                                        key={slot.id}
                                                        className={`${style.timeSlot} ${selectedSlot?.id === slot.id ? style.timeSlotSelected : ''
                                                            }`}
                                                        onClick={() => handleSlotSelect(slot)}
                                                    >
                                                        <div className={style.timeSlotTime}>
                                                            <FontAwesomeIcon icon={faClock} />
                                                            <span>{formatTime(slot.slotDateTime)}</span>
                                                        </div>
                                                        <div className={style.timeSlotStatus}>
                                                            {slot.isAvailable ? (
                                                                <span className={style.statusAvailable}>Свободно</span>
                                                            ) : (
                                                                <span className={style.statusBooked}>Занято</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Поле для ввода адреса */}
                                {selectedSlot && (
                                    <div className={style.addressSection}>
                                        <div className={style.addressHeader}>
                                            <FontAwesomeIcon icon={faMapPin} />
                                            <span>Укажите адрес для выгула собаки</span>
                                        </div>
                                        <div className={style.addressInputWrapper}>
                                            <textarea
                                                value={bookingAddress}
                                                onChange={(e) => setBookingAddress(e.target.value)}
                                                placeholder="Введите полный адрес, где нужно забрать собаку на выгул..."
                                                className={style.addressInput}
                                                rows="3"
                                            />
                                            <div className={style.addressHint}>
                                                Пожалуйста, укажите точный адрес (улица, дом, подъезд, этаж, код домофона)
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={style.bookingActions}>
                                    <button
                                        className={style.bookButton}
                                        onClick={handleBookSlot}
                                        disabled={!selectedSlot || bookingLoading || !bookingAddress.trim()}
                                    >
                                        {bookingLoading ? (
                                            <>
                                                <div className={style.buttonSpinner}></div>
                                                <span>Бронируем...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faCheck} className={style.buttonIcon} />
                                                <span>
                                                    {`Забронировать`}
                                                </span>
                                            </>
                                        )}
                                    </button>

                                    {selectedSlot && (
                                        <button
                                            className={style.clearButton}
                                            onClick={() => {
                                                setSelectedSlot(null);
                                                setBookingAddress('');
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                            <span>Отменить выбор</span>
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

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

export default DogWalkingViewComponent;