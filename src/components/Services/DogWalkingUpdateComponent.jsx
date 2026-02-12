import { useState, useEffect } from 'react';
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import style from './DogWalkingUpdateComponent.module.css';

function DogWalkingUpdateComponent({ serviceId }) {
    const
        [formData, setFormData] = useState({
            price: '',
            description: '',
            maxDogs: '',
            walkDurationMinutes: '',
            availableSlots: []
        }),
        [selectedDates, setSelectedDates] = useState([]),
        [selectedTimeSlots, setSelectedTimeSlots] = useState([]),
        [service, setService] = useState(null),
        [dogWalking, setDogWalking] = useState(null),
        [loading, setLoading] = useState(false),
        [initialLoading, setInitialLoading] = useState(true),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        accountApi = useAccountApi(),
        navigate = useNavigate();

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00',
        '20:00', '21:00', '22:00', '23:00'
    ];

    const formatDateToString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const displayDateFromString = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('ru-RU');
    };

    const formatSlotDate = (slot) => {
        try {
            if (slot.slotDateTime) {
                const date = new Date(slot.slotDateTime);
                if (!isNaN(date.getTime())) {
                    return {
                        date: formatDateToString(date),
                        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
                    };
                }
            }

            if (slot.date && slot.time) {
                if (slot.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return { date: slot.date, time: slot.time };
                }
                if (slot.date instanceof Date) {
                    return { date: formatDateToString(slot.date), time: slot.time };
                }
            }

            console.error('Некорректный формат слота:', slot);
            return null;
        } catch (error) {
            console.error('Ошибка форматирования даты:', error);
            return null;
        }
    };

    const displaySlotDateTime = (slot) => {
        try {
            if (slot.date && slot.time) {
                const dateStr = displayDateFromString(slot.date);
                return `${dateStr} ${slot.time}`;
            }

            return 'Некорректная дата';
        } catch (error) {
            console.error('Ошибка отображения даты:', error);
            return 'Ошибка формата';
        }
    };

    useEffect(() => {
        const fetchServiceData = async () => {
            if (!serviceId) {
                console.error('Service ID is missing!');
                setInitialLoading(false);
                return;
            }

            try {
                setInitialLoading(true);
                const serviceData = await accountApi.getServiceById(serviceId);
                setService(serviceData);

                const dogWalkingDetails = await accountApi.getDogWalkingService(serviceId);
                setDogWalking(dogWalkingDetails);

                const availableSlots = await accountApi.getAvailableSlots(serviceId);
                console.log('Available slots from API:', availableSlots);

                setFormData({
                    price: serviceData.price || '',
                    description: serviceData.description || '',
                    maxDogs: dogWalkingDetails?.maxDogs || '',
                    walkDurationMinutes: dogWalkingDetails?.walkDurationMinutes || '',
                    availableSlots: availableSlots || []
                });

                if (availableSlots && availableSlots.length > 0) {
                    const datesSet = new Set();
                    const timesArray = [];

                    availableSlots.forEach(slot => {
                        const formattedSlot = formatSlotDate(slot);
                        if (formattedSlot) {
                            datesSet.add(formattedSlot.date);
                            timesArray.push({
                                date: formattedSlot.date,
                                time: formattedSlot.time
                            });
                        }
                    });

                    setSelectedDates(Array.from(datesSet));
                    setSelectedTimeSlots(timesArray);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setSnackbarSeverity('error');
                setSnackbarMessage('Ошибка загрузки данных: ' + error.message);
                setSnackbarOpen(true);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchServiceData();
    }, [serviceId, accountApi]);

    const handleDateChange = (date) => {
        const dateStr = formatDateToString(date);
        setSelectedDates(prev => {
            if (prev.includes(dateStr)) {
                setSelectedTimeSlots(prevTimeSlots =>
                    prevTimeSlots.filter(slot => slot.date !== dateStr)
                );
                return prev.filter(d => d !== dateStr);
            } else {
                return [...prev, dateStr];
            }
        });
    };

    const handleTimeSlotToggle = (date, time) => {
        setSelectedTimeSlots(prev => {
            const existingIndex = prev.findIndex(slot =>
                slot.date === date && slot.time === time
            );

            if (existingIndex >= 0) {
                return prev.filter((_, index) => index !== existingIndex);
            } else {
                return [...prev, { date, time }];
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClearAllSlots = () => {
        setSelectedDates([]);
        setSelectedTimeSlots([]);
        setSnackbarSeverity('info');
        setSnackbarMessage('Все слоты очищены. Нажмите "Сохранить изменения" для подтверждения.');
        setSnackbarOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверяем наличие serviceId перед отправкой
        if (!serviceId) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Ошибка: ID услуги не найден');
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);

        try {
            // Обновляем основную информацию
            if (formData.price !== '' || formData.description !== '') {
                console.log('Updating general info for serviceId:', serviceId);
                await accountApi.updateServiceGeneralInfo(
                    serviceId,
                    formData.price,
                    formData.description
                );
            }

            // Обновляем параметры выгула
            if (dogWalking && (formData.maxDogs !== '' || formData.walkDurationMinutes !== '')) {
                console.log('Updating dog walking info for dogWalkingId:', dogWalking.id);
                await accountApi.updateDogWalkingInfo(
                    dogWalking.id,
                    parseInt(formData.maxDogs) || 0,
                    parseInt(formData.walkDurationMinutes) || 0
                );
            }

            // Сохраняем слоты (даже пустой массив)
            console.log('Saving slots for serviceId:', serviceId, 'Slots:', selectedTimeSlots);
            console.log('Number of slots to save:', selectedTimeSlots.length);

            // Всегда отправляем serviceId, даже если слотов 0
            await accountApi.updateServiceSlots(serviceId, selectedTimeSlots);

            setSnackbarSeverity('success');
            setSnackbarMessage(
                selectedTimeSlots.length > 0
                    ? 'Данные успешно обновлены!'
                    : 'Услуга обновлена. Слотов для бронирования нет.'
            );
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate('/services');
            }, 2000);

        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Ошибка при сохранении: ' + error.message);
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/services');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const getTimeSlotsForDate = (date) => {
        return timeSlots.map(time => {
            const isSelected = selectedTimeSlots.some(
                slot => slot.date === date && slot.time === time
            );
            return (
                <button
                    key={`${date}-${time}`}
                    type="button"
                    className={`${style.timeSlot} ${isSelected ? style.timeSlotSelected : ''}`}
                    onClick={() => handleTimeSlotToggle(date, time)}
                    disabled={loading}
                >
                    {time}
                </button>
            );
        });
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = formatDateToString(date);
            if (selectedDates.includes(dateStr)) {
                return style.selectedDate;
            }
        }
        return '';
    };

    if (initialLoading) {
        return (
            <div className={style.updateContainer}>
                <div className={style.loading}>Загрузка данных...</div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className={style.updateContainer}>
                <div className={style.errorMessage}>Услуга не найдена</div>
            </div>
        );
    }

    return (
        <div className={style.updateContainer}>
            <form onSubmit={handleSubmit} className={`${style.form} ${style.form_container}`}>
                <div className={style.section}>
                    <h3 className={style.sectionTitle}>Основная информация</h3>

                    <div className={style.mainInfoGrid}>
                        <div className={style.inputsColumn}>
                            <div className={style.formGroup}>
                                <label htmlFor="price">Цена (₽):</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={style.input}
                                    placeholder="Введите цену"
                                    disabled={loading}
                                    min="0"
                                />
                            </div>

                            <div className={style.formGroup}>
                                <label htmlFor="maxDogs">Максимум собак за раз:</label>
                                <input
                                    type="number"
                                    id="maxDogs"
                                    name="maxDogs"
                                    value={formData.maxDogs}
                                    onChange={handleChange}
                                    className={style.input}
                                    disabled={loading}
                                    min="1"
                                    max="10"
                                    placeholder="Например: 3"
                                />
                            </div>

                            <div className={style.formGroup}>
                                <label htmlFor="walkDurationMinutes">Длительность прогулки:</label>
                                <select
                                    id="walkDurationMinutes"
                                    name="walkDurationMinutes"
                                    value={formData.walkDurationMinutes}
                                    onChange={handleChange}
                                    className={style.select}
                                    disabled={loading}
                                >
                                    <option value="">Выберите длительность</option>
                                    <option value="30">30 минут</option>
                                    <option value="45">45 минут</option>
                                    <option value="60">1 час</option>
                                    <option value="90">1.5 часа</option>
                                    <option value="120">2 часа</option>
                                </select>
                            </div>
                        </div>

                        <div className={style.descriptionColumn}>
                            <label htmlFor="description">Описание услуги:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={style.textarea}
                                rows="8"
                                disabled={loading}
                                placeholder="Опишите вашу услугу выгула собак. Например: опытный выгульщик, знание особенностей пород, возможность забрать и вернуть собаку, наличие игр и тренировок во время прогулки."
                            />
                        </div>
                    </div>
                </div>

                <div className={style.section}>
                    <h3 className={style.sectionTitle}>Доступные для бронирования даты и время</h3>
                    <p className={style.sectionDescription}>
                        Выберите даты и время, когда вы доступны для выгула собак. Клиенты смогут бронировать выбранные слоты.
                        Чтобы удалить все слоты, нажмите "Очистить все слоты" и сохраните изменения.
                    </p>

                    <div className={style.calendarSection}>
                        <div className={style.calendarContainer}>
                            <Calendar
                                onChange={handleDateChange}
                                value={null}
                                tileClassName={tileClassName}
                                selectRange={false}
                                locale="ru-RU"
                                minDate={new Date()}
                                maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                                className={style.calendar}
                            />
                        </div>

                        <div className={style.timeSlotsSection}>
                            <div className={style.sectionHeader}>
                                <h4>Выбранные даты:</h4>
                                {selectedTimeSlots.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleClearAllSlots}
                                        className={style.clearAllButton}
                                        disabled={loading}
                                        title="Очистить все слоты"
                                    >
                                        Очистить все
                                    </button>
                                )}
                            </div>

                            {selectedDates.length === 0 ? (
                                <p className={style.noDates}>
                                    {selectedTimeSlots.length === 0
                                        ? 'Нет выбранных дат. Выберите даты в календаре или сохраните без слотов.'
                                        : 'Выберите даты в календаре для отображения временных слотов'}
                                </p>
                            ) : (
                                <div className={style.selectedDatesList}>
                                    {selectedDates.map(date => (
                                        <div key={date} className={style.dateSlot}>
                                            <div className={style.dateHeader}>
                                                <strong>{displayDateFromString(date)}</strong>
                                                <button
                                                    type="button"
                                                    className={style.removeDate}
                                                    onClick={() => {
                                                        const [year, month, day] = date.split('-').map(Number);
                                                        const jsDate = new Date(year, month - 1, day);
                                                        handleDateChange(jsDate);
                                                    }}
                                                    disabled={loading}
                                                    title="Удалить дату"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div className={style.timeSlotsGrid}>
                                                {getTimeSlotsForDate(date)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={style.slotsSummary}>
                        <div className={style.summaryHeader}>
                            <strong>Выбрано слотов: {selectedTimeSlots.length}</strong>
                            {selectedTimeSlots.length === 0 && (
                                <span className={style.warningText}>
                                    Без слотов услуга будет недоступна для бронирования
                                </span>
                            )}
                        </div>
                        {selectedTimeSlots.length > 0 && (
                            <div className={style.slotsList}>
                                {selectedTimeSlots.map((slot, index) => (
                                    <div key={index} className={style.slotBadge}>
                                        {displaySlotDateTime(slot)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={style.buttons}>
                    <button
                        type="submit"
                        className={style.submitButton}
                        disabled={loading}
                        title="Сохранить изменения (можно сохранить и без слотов)"
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} color="inherit" />
                                <span style={{ marginLeft: '8px' }}>Сохранение...</span>
                            </>
                        ) : 'Сохранить изменения'}
                    </button>

                    <button
                        type="button"
                        onClick={handleClearAllSlots}
                        className={style.submitButton}
                        disabled={loading || selectedTimeSlots.length === 0}
                        title="Очистить все выбранные слоты"
                    >
                        Очистить все слоты
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className={style.cancelButton}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                </div>
            </form>

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

export default DogWalkingUpdateComponent;