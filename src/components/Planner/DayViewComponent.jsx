import style from './DayViewComponent.module.css';

function DayViewComponent({ day, tasks }) {
    const dayOfWeek = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(day);
    const dayOfMonth = day.getDate();

    return (
        <div>
            <div className={style.day_header}>
                <span className={style.day_of_week}>{`${dayOfWeek}, ${dayOfMonth}`}</span>
            </div>
            <div className={`${style.day_view}`}>

                <div className={style.task_list}>
                    {tasks && tasks.length > 0 && (
                        tasks.map((task) => (
                            <div key={task.id} className={`${style.task_item} ${style.task_item_divider}`}>
                                {task.text}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayViewComponent;