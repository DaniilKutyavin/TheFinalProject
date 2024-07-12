import React, { useEffect, useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getOne, registerUserToEvent, unregisterUserFromEvent, fetchEventRegistrations } from "../http/eventApi";
import { getOrganization } from "../http/orgApi";
import { Context } from "../index";
import style from '../style/card.module.css';
import { LOGIN_ROUTE, PROFILEUSER_ROUTE } from "../utils/consts";

const Event = observer(() => {
    const { user } = useContext(Context);
    const [event, setEvent] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventAndOrganization = async () => {
            try {
                const eventData = await getOne(id);
                setEvent(eventData);

                if (eventData.organizerId) {
                    const organizationData = await getOrganization(eventData.organizerId);
                    setOrganization(organizationData);
                }

                const registrations = await fetchEventRegistrations(id);
                setIsRegistered(registrations.some(reg => reg.userId === user.user.id));

            } catch (error) {
                console.error("Error fetching event or organization:", error);
            }
        };

        if (user.user && id) {
            fetchEventAndOrganization();
        }
    }, [id, user.user]);

    const handleRegister = async () => {
        try {
            await registerUserToEvent(user.user.id, event.id);
            setIsRegistered(true);
            const updatedEvent = { ...event, Event_Regs: [...(event.Event_Regs || []), { userId: user.user.id }] };
            setEvent(updatedEvent);
            alert("Вы успешно зарегистрировались на мероприятие!");
            navigate(PROFILEUSER_ROUTE);
        } catch (error) {
            console.error("Error registering to event:", error);
            alert("Ошибка при регистрации на мероприятие.");
        }
    };

    const handleUnregister = async () => {
        try {
            await unregisterUserFromEvent(user.user.id, event.id);
            setIsRegistered(false);
            const updatedEventRegs = event.Event_Regs ? event.Event_Regs.filter(reg => reg.userId !== user.user.id) : [];
            const updatedEvent = { ...event, Event_Regs: updatedEventRegs };
            setEvent(updatedEvent);
            alert("Вы успешно отписались от мероприятия!");
            navigate(PROFILEUSER_ROUTE);
        } catch (error) {
            console.error("Error unregistering from event:", error);
            alert("Ошибка при отписке от мероприятия.");
        }
    };

    if (!event) {
        return <div>Loading event...</div>;
    }

    const isOrganizer = user.user.id === event.organizerId;

    return (
        <div className={style.pageWrapper}>
            <div className={style.container}>
                <div className={style.eventCard}>
                    <img src={process.env.REACT_APP_API_URL + event.photo} alt={event.title} className={style.eventImage} />
                    <div className={style.eventDetails}>
                        <h2>{event.title}</h2>
                        <p><strong>Описание:</strong> {event.description}</p>
                        <p><strong>Дата:</strong> {event.date_time}</p>
                        <p><strong>Адрес:</strong> {event.locate || '-'}</p>
                        <p><strong>Координаты:</strong> {event.coordinates}</p>
                        <p><strong>Время начала:</strong> {event.time_start}</p>
                        <p><strong>Время конца:</strong> {event.time_end}</p>
                        <p><strong>Цена:</strong> {event.price} руб.</p>
                        <p><strong>Всего мест:</strong> {event.capacityAll}</p>
                        <p><strong>Осталось мест:</strong> {event.capacity}</p>
                        {organization ? (
                            <p><strong>Организатор:</strong> {organization.name}</p>
                        ) : (
                            <p>Loading organization...</p>
                        )}
                    </div>
                    {user.isAuth && !isOrganizer ? (
                        isRegistered ? (
                            <button onClick={handleUnregister} className={style.formbutton}>Отписаться</button>
                        ) : (
                            event.capacity > 0 ? (
                            <button onClick={handleRegister} className={style.formbutton}>Зарегистрироваться</button>
                            ) :
                            (
                                <p>Нет мест</p>
                            )
                        )
                    ) : (
                        !user.isAuth ? (
                            <p>Вы организатор мероприятия</p>
                        ) : (
                            <Link to={LOGIN_ROUTE}><button className={style.formbutton}>Зарегистрироваться</button></Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
});

export default Event;
