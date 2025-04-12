import React, { useState, useEffect } from 'react';
import style from './DayComponent.module.css';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAccountApi } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';
import ContentContainer from '../ContentContainer';
import TaskItem from './TaskItem';

function DayComponent() {
    const
        [tasks, setTasks] = useState([]),
        [newTask, setNewTask] = useState(''),
        [editingTaskIndex, setEditingTaskIndex] = useState(null),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        [addTaskLoading, setAddTaskLoading] = useState(false),
        accounApi = useAccountApi(),
        location = useLocation(),
        navigate = useNavigate(),
        profileId = localStorage.getItem('profileId'),
        day = location.state?.day;

    useEffect(() => {
        const fetchTasks = async () => {
            const profileId = localStorage.getItem('profileId');
            const data = location.state?.day;
            const day = data.toISOString().split('T')[0];
            const response = await accounApi.getTasksForDate(day, profileId);
            setTasks(response);
        };
        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        setAddTaskLoading(true);
        try {
            if (newTask.trim()) {
                const formatteDay = day.toISOString().split('T')[0];

                const newTaskResponse = await accounApi.addTask(newTask, formatteDay, profileId);
                setSnackbarSeverity('success');
                setSnackbarMessage('Запись добавлена');
                setSnackbarOpen(true);
                setTasks([...tasks, { id: newTaskResponse.id, text: newTask.trim() }]);
                setNewTask('');
            }
        }
        finally {
            setAddTaskLoading(false);
        }
    };

    const handleDeleteTask = async (taskId, index) => {
        await accounApi.deleteTask(taskId);
        setSnackbarSeverity('success');
        setSnackbarMessage('Запись удалена');
        setSnackbarOpen(true);
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
        if (editingTaskIndex === index) {
            setEditingTaskIndex(null);
        }
    };

    const handleSaveEdit = async (taskId, editedTask, index) => {
        await accounApi.updateTask(taskId, editedTask);
        setSnackbarSeverity('success');
        setSnackbarMessage('Запись сохранена');
        setSnackbarOpen(true);
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], text: editedTask.trim() };
        setTasks(newTasks);
        setEditingTaskIndex(null);
    };

    const handleClose = async () => {
        navigate("/calendar");
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <ContentContainer>
            <div className={`${style.day_view}`}>
                <div className={style.day_header}>
                    <h3>{new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(day)}</h3>
                    <button onClick={() => handleClose()} className={style.close_button}>Закрыть</button>
                </div>

                <div className={style.day_content_expanded}>
                    <ul className={style.task_list}>
                        {tasks.map((task, index) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                index={index}
                                onUpdateTask={handleSaveEdit}
                                onDeleteTask={handleDeleteTask}
                            />
                        ))}
                    </ul>

                    <div className={style.add_task_container}>
                        <input
                            type="text"
                            placeholder="Добавить задачу"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className={style.add_task_input}
                        />
                        <button onClick={() => handleAddTask()} disabled={addTaskLoading} className={style.add_task_button}>
                            {addTaskLoading ? <CircularProgress size={24} color="inherit" /> : 'Добавить'}
                        </button>
                    </div>
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
        </ContentContainer >
    );
};

export default DayComponent;