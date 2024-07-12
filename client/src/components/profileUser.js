import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { logout } from "../http/userApi";
import { logoutOrg } from "../http/orgApi";
import { EVENT_ROUTE, MAIN_ROUTE } from '../utils/consts';
import { fetchArchivedEventsForUser, fetchActiveEventsForUser } from '../http/eventApi';
import style from '../style/userprofile.module.css';
import logo from '../image/logo.png';

const ProfileUSER = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (user.isAuth) {
      fetchActiveEventsForUser(user.user.id).then(data => setEvents(data));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      if (user.isAuth) {
        await logout();
        user.clearUser();
      } else {
        await logoutOrg();
        user.clearOrganization();
      }
      navigate(MAIN_ROUTE);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const loadArchivedEvents = async () => {
    if (user.isAuth) {
      const data = await fetchArchivedEventsForUser(user.user.id);
      setEvents(data);
      setIsArchived(true);
    }
  };

  const loadActiveEvents = async () => {
    if (user.isAuth) {
      const data = await fetchActiveEventsForUser(user.user.id);
      setEvents(data);
      setIsArchived(false);
    }
  };

  const handleCardClick = (eventId) => {
    navigate(`${EVENT_ROUTE}/${eventId}`);
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.sidebar}>
          <img src={logo} alt="Лого" className={style.logo} />
          <ul className={style.menu}>
            <li><Link to="#" onClick={loadActiveEvents}>Мои записи</Link></li>
            <li><Link to="#" onClick={loadArchivedEvents}>Архив мероприятий</Link></li>
            <li><Link to={MAIN_ROUTE}>Назад на карту</Link></li>
            <li><Link to="#" onClick={handleLogout}>Выход</Link></li>
          </ul>
        </div>
        <div className={style.contentWrapper}>
          <div className={style.mainContent}>
            <h1>{isArchived ? 'Архивные мероприятия' : 'Мои записи'}</h1>
            <div className={style.cardsContainer}>
              {events.map(event => (
                <div key={event.id} className={style.card} onClick={() => handleCardClick(event.id)}>
                  <img src={process.env.REACT_APP_API_URL + event.photo} alt={event.title} className={style.cardImage} />
                  <div className={style.cardContent}>
                    <h3>{event.title}</h3>
                    <p>{event.date_time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUSER;
