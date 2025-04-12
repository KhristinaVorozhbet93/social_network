import React, { useState, useEffect, useRef } from 'react';
import style from './Calendar.module.css';
import { useAccountApi } from '../../App';
import ContentContainer from '../ContentContainer';
import DayViewComponent from './DayViewComponent';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendarIcon from '../../images/datepicker.png';

function Calendar() {
    const
        [currentDate, setCurrentDate] = useState(new Date()),
        [selectedDay, setSelectedDay] = useState(null),
        [tasks, setTasks] = useState({}),
        [showDatePicker, setShowDatePicker] = useState(false),
        accountApi = useAccountApi(),
        navigate = useNavigate();

    const handleDateChange = (date) => {
        setCurrentDate(date);
        setSelectedDay(date);
        navigate("/calendar/day", {
            state:
            {
                day: date
            }
        })
    };

    const getDaysInWeek = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
        const days = [];
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(startOfWeek);
            nextDay.setDate(startOfWeek.getDate() + i);
            days.push(nextDay);
        }
        return days;
    };

    const daysInWeek = getDaysInWeek(currentDate);

    const handlePrevWeek = () => {
        const prevWeek = new Date(currentDate);
        prevWeek.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevWeek);
        setSelectedDay(null);
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(currentDate);
        nextWeek.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextWeek);
        setSelectedDay(null);
    };

    const handleDayClick = (day) => {
        navigate("/calendar/day", {
            state:
            {
                day: day
            }
        })
    };

    const handleCloseDayView = () => {
        setSelectedDay(null);
    };


    const fetchTasksForWeek = async (weekStartDate) => {
        const weekEnd = new Date(weekStartDate);
        weekEnd.setDate(weekStartDate.getDate() + 6);

        const startDateString = weekStartDate.toISOString().split('T')[0];
        const endDateString = weekEnd.toISOString().split('T')[0];

        const profileId = localStorage.getItem('profileId');
        const data = await accountApi.getTasksForPeriod(startDateString, endDateString, profileId);
        const tasksByDate = {};
        data.forEach(task => {
            const taskDate = new Date(task.date).toISOString().split('T')[0];
            if (!tasksByDate[taskDate]) {
                tasksByDate[taskDate] = [];
            }
            tasksByDate[taskDate].push(task);
        });

        setTasks(tasksByDate);
    };


    useEffect(() => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
        fetchTasksForWeek(startOfWeek);
    }, [currentDate]);


    const getTasksForDay = (day) => {
        const dayKey = day.toISOString().split('T')[0];
        return tasks[dayKey] || [];
    };

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    const weekStart = daysInWeek[0];
    const weekEnd = daysInWeek[6];

    const datepickerRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (datepickerRef.current && !datepickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        }

        if (showDatePicker) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDatePicker]);

    return (
        <ContentContainer>
            <div>
                <div className={style.calendar_container}>
                    <button className={style.calendar_icon_button} onClick={toggleDatePicker}>
                    <img src={calendarIcon} alt="Calendar Icon" className={style.icon} />
                    </button>

                    {showDatePicker && (
                        <div className={style.modal_overlay}>
                            <div className={style.modal_content} ref={datepickerRef}>
                                <button className={style.modal_close_button} onClick={() => setShowDatePicker(false)}>
                                    &times;
                                </button>
                                <DatePicker
                                    selected={currentDate}
                                    onChange={handleDateChange}
                                    inline
                                    dateFormat="dd/MM/yyyy"
                                    shouldCloseOnSelect={true}
                                    className={style.datepicker}
                                />
                            </div>
                        </div>
                    )}
                    <div className={style.calendar_header}>
                        <button onClick={handlePrevWeek}>&lt;</button>
                        <div className={style.calendar_header_content}>
                            <h2>{new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(currentDate)}</h2>
                            <p>
                                <p>{new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(weekStart)}  - {new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(weekEnd)}</p>
                            </p>
                        </div>
                        <button onClick={handleNextWeek}>&gt;</button>
                    </div>

                    {selectedDay ? (
                        <DayViewComponent
                            day={selectedDay}
                            isExpanded={true}
                            onClose={handleCloseDayView}
                            tasks={getTasksForDay(selectedDay)}
                        />
                    ) : (
                        <div className={style.week_view}>
                            <div className={`${style.left_page} ${style.page}`}>
                                {daysInWeek.slice(0, 3).map((day) => (
                                    <div key={day.toISOString()} onClick={() => handleDayClick(day)}>
                                        <DayViewComponent
                                            key={day.toISOString()}
                                            day={day}
                                            isExpanded={false}
                                            tasks={getTasksForDay(day)}
                                        />
                                    </div>

                                ))}
                            </div>
                            <div className={`${style.right_page} ${style.page}`}>
                                {daysInWeek.slice(3, 7).map((day) => (
                                    <div key={day.toISOString()} onClick={() => handleDayClick(day)}>
                                        <DayViewComponent
                                            key={day.toISOString()}
                                            day={day}
                                            isExpanded={false}
                                            tasks={getTasksForDay(day)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ContentContainer >
    );
};

export default Calendar;
