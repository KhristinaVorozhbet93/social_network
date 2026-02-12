import { useState, useEffect } from 'react';
import style from './UserBookingComponent.module.css';
import { useAccountApi } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faTimes,
    faClock,
    faHourglassHalf,
    faCalendarAlt,
    faMapMarkerAlt,
    faMoneyBillWave,
    faUser,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import { BookingStatus } from '../ServiceTypeMapping';
import ContentContainer from '../Layout/ContentContainer';
import { Alert, Snackbar } from '@mui/material';

function UserBookingComponent() {
    const
        [bookings, setBookings] = useState([]),
        [services, setServices] = useState({}),
        [loading, setLoading] = useState(true),
        [updatingBookingId, setUpdatingBookingId] = useState(null),
        [deletingBookingId, setDeletingBookingId] = useState(null),
        [error, setError] = useState(null),
        [activeTab, setActiveTab] = useState(0),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        profileId = localStorage.getItem('profileId'),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!profileId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const userBookings = await accountApi.getUserBookings(profileId);
                setBookings(userBookings);
                const uniqueServiceIds = [...new Set(userBookings.map(booking => booking.serviceId))];
                const servicesData = {};
                for (const serviceId of uniqueServiceIds) {
                    const service = await accountApi.getServiceById(serviceId);
                    servicesData[serviceId] = {
                        ...service
                    };
                }

                setServices(servicesData);
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, [profileId, accountApi]);

    const bookingsByService = bookings.reduce((groups, booking) => {
        const serviceId = booking.serviceId;
        if (!groups[serviceId]) {
            groups[serviceId] = [];
        }
        groups[serviceId].push(booking);
        return groups;
    }, {});

    const serviceIds = Object.keys(bookingsByService);

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    const formatDateTime = (dateString) => {
        try {
            if (!dateString) return "Дата не указана";

            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Некорректная дата";
            }

            return date.toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Ошибка форматирования даты:', error);
            return dateString || "Дата не указана";
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case BookingStatus.Pending:
                return {
                    label: "Ожидает подтверждения",
                    color: "#ff9800",
                    icon: faHourglassHalf,
                    className: style.statusPending
                };
            case BookingStatus.Confirmed:
                return {
                    label: "Подтверждено",
                    color: "#2196f3",
                    icon: faClock,
                    className: style.statusConfirmed
                };
            case BookingStatus.Cancelled:
                return {
                    label: "Отменено",
                    color: "#f44336",
                    icon: faTimes,
                    className: style.statusCancelled
                };
            case BookingStatus.Completed:
                return {
                    label: "Завершено",
                    color: "#4caf50",
                    icon: faCheck,
                    className: style.statusCompleted
                };
            default:
                return {
                    label: "Неизвестно",
                    color: "#9e9e9e",
                    icon: faClock,
                    className: style.statusDefault
                };
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        setUpdatingBookingId(bookingId);
        try {
            await accountApi.updateBookingStatus(bookingId, newStatus);

            setBookings(prev => prev.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: newStatus }
                    : booking
            ));

            const statusMessages = {
                [BookingStatus.Completed]: 'Услуга успешно завершена',
                [BookingStatus.Cancelled]: 'Бронирование успешно отменено'
            };

            showSnackbar(statusMessages[newStatus] || 'Статус бронирования обновлен');
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            showSnackbar('Ошибка обновления статуса: ' + error.message, 'error');
        } finally {
            setUpdatingBookingId(null);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        setDeletingBookingId(bookingId);
        try {
            await accountApi.deleteBooking(bookingId);
            setBookings(prev => prev.filter(booking => booking.id !== bookingId));
            showSnackbar('Бронирование успешно удалено');
        } catch (error) {
            console.error('Ошибка удаления бронирования:', error);
            showSnackbar('Ошибка удаления бронирования: ' + error.message, 'error');
        } finally {
            setDeletingBookingId(null);
        }
    };

    const canDeleteBooking = (status) => {
        return status !== BookingStatus.Confirmed;
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <ContentContainer>
                <div className={style.bookingsLoading}>
                    <div className={style.spinner}></div>
                    <div className={style.loadingText}>
                        Загрузка ваших бронирований...
                    </div>
                </div>
            </ContentContainer>
        );
    }

    if (bookings.length === 0) {
        return (
            <ContentContainer>
                <div className={style.noBookings}>
                    <div className={style.noBookingsIcon}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <h3 className={style.noBookingsTitle}>
                        У вас нет активных бронирований
                    </h3>
                </div>
            </ContentContainer>
        );
    }

    return (
        <ContentContainer>
            <div className={style.bookingsContainer}>
                <div className={style.sectionHeader}>
                    <h2 className={style.sectionTitle}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        Мои бронирования
                    </h2>
                </div>

                {serviceIds.map((serviceId, index) => {
                    if (index !== activeTab) return null;

                    const service = services[serviceId];
                    const serviceBookings = bookingsByService[serviceId];

                    return (
                        <div key={serviceId} className={style.tabContentWrapper}>
                            <div className={style.bookingsList}>
                                {serviceBookings.map((booking) => {
                                    const statusInfo = getStatusInfo(booking.status);
                                    const isUpdating = updatingBookingId === booking.id;
                                    const isDeleting = deletingBookingId === booking.id;
                                    const isPending = booking.status === BookingStatus.Pending;
                                    const isConfirmed = booking.status === BookingStatus.Confirmed;
                                    const isCancelled = booking.status === BookingStatus.Cancelled;
                                    const isCompleted = booking.status === BookingStatus.Completed;
                                    const canComplete = isConfirmed && !isCompleted;
                                    const canCancel = (isPending || isConfirmed) && !isCompleted && !isCancelled;
                                    const canDelete = canDeleteBooking(booking.status);

                                    return (
                                        <div key={booking.id} className={style.bookingCard}>
                                            <div className={style.bookingContent}>
                                                <div className={style.bookingHeader}>
                                                    <div className={style.bookingInfo}>
                                                        <div className={style.bookingId}>
                                                            <FontAwesomeIcon icon={faUser} />
                                                            <span>Бронирование #{booking.id.slice(0, 8)}</span>
                                                        </div>
                                                        <div className={style.bookingDateTime}>
                                                            <FontAwesomeIcon icon={faClock} />
                                                            <span>Создано: {formatDateTime(booking.createdAt || booking.bookedAt)}</span>
                                                        </div>
                                                    </div>

                                                    <div className={style.bookingStatus}>
                                                        <div className={`${style.statusChip} ${statusInfo.className}`}>
                                                            <FontAwesomeIcon icon={statusInfo.icon} className={style.statusIcon} />
                                                            <span>{statusInfo.label}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={style.bookingDetails}>
                                                    <div className={style.bookingDetail}>
                                                        <div className={style.bookingDetailLabel}>
                                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                                            <span>Запланировано на:</span>
                                                        </div>
                                                        <div className={style.bookingDetailValue}>
                                                            {formatDateTime(booking.slot.slotDateTime)}
                                                        </div>
                                                    </div>

                                                    <div className={style.bookingDetail}>
                                                        <div className={style.bookingDetailLabel}>
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                            <span>Место оказания:</span>
                                                        </div>
                                                        <div className={style.bookingDetailValue}>
                                                            {booking.address || "Адрес не указан"}
                                                        </div>
                                                    </div>

                                                    {service.price > 0 && (
                                                        <div className={style.bookingDetail}>
                                                            <div className={style.bookingDetailLabel}>
                                                                <FontAwesomeIcon icon={faMoneyBillWave} />
                                                                <span>Стоимость:</span>
                                                            </div>
                                                            <div className={style.bookingDetailValue}>
                                                                {service.price.toLocaleString('ru-RU')} ₽
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={style.bookingActions}>
                                                    {canComplete && (
                                                        <button
                                                            className={style.completeButton}
                                                            onClick={() => handleUpdateBookingStatus(booking.id, BookingStatus.Completed)}
                                                            disabled={isUpdating}
                                                        >
                                                            {isUpdating ? (
                                                                <>
                                                                    <div className={style.buttonSpinner}></div>
                                                                    <span>Завершение...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FontAwesomeIcon icon={faCheck} className={style.buttonIcon} />
                                                                    <span>Завершить услугу</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    )}

                                                    {canCancel && (
                                                        <button
                                                            className={style.cancelButton}
                                                            onClick={() => handleUpdateBookingStatus(booking.id, BookingStatus.Cancelled)}
                                                            disabled={isUpdating}
                                                        >
                                                            {isUpdating ? (
                                                                <>
                                                                    <div className={style.buttonSpinner}></div>
                                                                    <span>Отмена...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FontAwesomeIcon icon={faTimes} className={style.buttonIcon} />
                                                                    <span>Отменить бронирование</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    )}

                                                    {canDelete && (
                                                        <button
                                                            className={style.deleteButton}
                                                            onClick={() => handleDeleteBooking(booking.id)}
                                                            disabled={isDeleting}
                                                        >
                                                            {isDeleting ? (
                                                                <>
                                                                    <div className={style.buttonSpinner}></div>
                                                                    <span>Удаление...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FontAwesomeIcon icon={faTrash} className={style.buttonIcon} />
                                                                    <span>Удалить бронирование</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

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
        </ContentContainer>
    );
}

export default UserBookingComponent;