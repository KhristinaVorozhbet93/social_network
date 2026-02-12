import { useState, useEffect } from 'react';
import style from './DogWalkingBookingComponent.module.css';
import { useAccountApi } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faClock, faHourglassHalf, faUser, faCalendarAlt, faMapMarkerAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { BookingStatus } from '../ServiceTypeMapping';
import { Alert, Snackbar } from '@mui/material';

function DogWalkingBookingComponent({ service, profileId }) {
    const
        [bookings, setBookings] = useState([]),
        [userProfiles, setUserProfiles] = useState({}),
        [loading, setLoading] = useState(true),
        [updatingBookingId, setUpdatingBookingId] = useState(null),
        [error, setError] = useState(null),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        accountApi = useAccountApi();

    const STATUS_MESSAGES = {
        [BookingStatus.Pending]: 'Статус изменен на "Ожидает подтверждения"',
        [BookingStatus.Confirmed]: 'Бронирование успешно подтверждено',
        [BookingStatus.Cancelled]: 'Бронирование успешно отменено',
        [BookingStatus.Completed]: 'Услуга успешно завершена'
    };

    useEffect(() => {
        const fetchBookings = async () => {
            if (!profileId || !service.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const serviceBookings = await accountApi.getBookings(service.id);
                setBookings(serviceBookings);
                const uniqueProfileIds = [...new Set(serviceBookings.map(booking => booking.profileId))];
                const profiles = {};
                for (const profileId of uniqueProfileIds) {
                    try {
                        const userProfile = await accountApi.getUserProfileById(profileId);
                        profiles[profileId] = userProfile;
                    } catch (err) {
                        console.error(`Ошибка загрузки профиля ${profileId}:`, err);
                        profiles[profileId] = { firstName: 'Неизвестно', lastName: '' };
                    }
                }

                setUserProfiles(profiles);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [service.id, profileId, accountApi]);

    const getUserName = (profileId) => {
        const userProfile = userProfiles[profileId];
        if (!userProfile) return "Загрузка...";

        return `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || "Неизвестный пользователь";
    };

    const getUserPhoto = (profileId) => {
        const userProfile = userProfiles[profileId];
        return userProfile?.photoUrl || null;
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

            showSnackbar(STATUS_MESSAGES[newStatus] || 'Статус бронирования обновлен');
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            showSnackbar('Ошибка обновления статуса: ' + error.message, 'error');
        } finally {
            setUpdatingBookingId(null);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <div className={style.bookingsLoading}>
                <div className={style.spinner}></div>
                <div className={style.loadingText}>
                    Загрузка бронирований...
                </div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className={style.noBookings}>
                <div className={style.noBookingsIcon}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <h3 className={style.noBookingsTitle}>
                    Эту услугу еще никто не забронировал
                </h3>
            </div>
        );
    }

    return (
        <div className={style.bookingsContainer}>
            <div className={style.bookingsTitle}>
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Бронирования услуги</span>
            </div>

            <div className={style.bookingsList}>
                {bookings.map((booking) => {
                    const statusInfo = getStatusInfo(booking.status);
                    const userName = getUserName(booking.profileId);
                    const userPhoto = getUserPhoto(booking.profileId);
                    const isPending = booking.status === BookingStatus.Pending;
                    const isConfirmed = booking.status === BookingStatus.Confirmed;
                    const isCancelled = booking.status === BookingStatus.Cancelled;
                    const isCompleted = booking.status === BookingStatus.Completed;
                    const isUpdating = updatingBookingId === booking.id;

                    return (
                        <div key={booking.id} className={style.bookingCard}>
                            <div className={style.bookingContent}>
                                <div className={style.bookingHeader}>
                                    <div className={style.bookingUserInfo}>
                                        <div className={style.userAvatarContainer}>
                                            {userPhoto ? (
                                                <img
                                                    src={userPhoto}
                                                    alt={userName}
                                                    className={style.userAvatar}
                                                />
                                            ) : (
                                                <div className={style.userAvatarPlaceholder}>
                                                    <FontAwesomeIcon icon={faUser} />
                                                </div>
                                            )}
                                        </div>
                                        <div className={style.userInfo}>
                                            <div className={style.bookingUserName}>
                                                <span>{userName}</span>
                                            </div>
                                            <div className={style.bookingDateTime}>
                                                <FontAwesomeIcon icon={faClock} />
                                                <span>Забронировано: {formatDateTime(booking.bookedAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={style.bookingStatusActions}>
                                        <div className={`${style.statusChip} ${statusInfo.className}`}>
                                            <FontAwesomeIcon icon={statusInfo.icon} className={style.statusIcon} />
                                            <span>{statusInfo.label}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={style.bookingDetails}>
                                    <div className={style.bookingDetail}>
                                        <div className={style.bookingDetailLabel}>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            <span>Адрес услуги:</span>
                                        </div>
                                        <div className={style.bookingDetailValue}>
                                            {booking.address || "Адрес не указан"}
                                        </div>
                                    </div>

                                    {service.price && (
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

                                <div className={style.quickActions}>
                                    {isPending && (
                                        <button
                                            className={style.confirmButton}
                                            onClick={() => handleUpdateBookingStatus(booking.id, BookingStatus.Confirmed)}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <div className={style.buttonSpinner}></div>
                                                    <span>Подтверждение...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faCheck} className={style.buttonIcon} />
                                                    <span>Подтвердить бронирование</span>
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {isConfirmed && (
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

                                    {(isPending || isConfirmed) && !isCompleted && (
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
                                </div>
                            </div>
                        </div>
                    );
                })}
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

export default DogWalkingBookingComponent;