import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '..'; 
import { logout } from "../http/userApi";
import { logoutOrg } from "../http/orgApi";
import { MAIN_ROUTE, ACTIVEEVENT_ROUTE, ARCHIVEDEVENT_ROUTE, CREATEEVENT_ROUTE, PROFILEORG_ROUTE, EVENT_ROUTE } from '../utils/consts';
import style from '../style/userprofile.module.css'; 
import { observer } from 'mobx-react-lite';
import logo from '../image/logo.png';

const ArchivedEvent = observer(() => {
  const { user, organization, event } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (organization.organization.id) {
      event.loadArchivedEvents(organization.organization.id);
    }
  }, [organization.organization.id, event]);

  const handleLogout = async () => {
    try {
      if (user.isAuth) {
        await logout();
        user.clearUser();
      } else if (organization.isAuth) {
        await logoutOrg();
        organization.clearOrganization();
      }
      navigate(MAIN_ROUTE);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.sidebar}>
        <img src={logo} alt="Лого" className={style.logo} />
          <ul className={style.menu}>
            <ul className={style.menu}>
              <li><Link to={PROFILEORG_ROUTE}>Профиль организации</Link></li>
              <li><Link to={CREATEEVENT_ROUTE}>Добавить мероприятие</Link></li>
              <li><Link to={ACTIVEEVENT_ROUTE}>Активные мероприятия</Link></li>
              <li><Link to={ARCHIVEDEVENT_ROUTE}>Архив мероприятий</Link></li>
              <li><Link to={MAIN_ROUTE}>Назад на карту</Link></li>
              <li><Link to="#" onClick={handleLogout}>Выход</Link></li>
            </ul>

          </ul>
        </div>
        <div className={style.contentWrapper}>
          <div className={style.mainContent}>
            <h1>Архивные мероприятия</h1>
            {event.events.length > 0 ? (
              <div className={style.cardsContainer}>
                {event.events.map(evt => (
                  <div key={evt.id} className={style.card} onClick={() => navigate(`${EVENT_ROUTE}/${evt.id}`)}>
                    <img src={process.env.REACT_APP_API_URL + evt.photo} alt={evt.title} className={style.cardImage} />
                    <div className={style.cardContent}>
                      <h2>{evt.title}</h2>
                      <p><strong>Описание:</strong> {evt.description}</p>
                      <p><strong>Дата:</strong> {evt.date_time}</p>
                      <p><strong>Время:</strong> {evt.time_start} - {evt.time_end}</p>
                      <p><strong>Место:</strong> {evt.locate}</p>
                      <p><strong>Цена:</strong> {evt.price} руб.</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Архивных мероприятий нет</p>
            )}
          </div>
        </div>
      </div>


    </div>

  );
});

export default ArchivedEvent;
