import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '..'; 
import { logoutOrg, updateProfileOrg } from "../http/orgApi";
import { MAIN_ROUTE, ACTIVEEVENT_ROUTE, ARCHIVEDEVENT_ROUTE, CREATEEVENT_ROUTE, PROFILEORG_ROUTE } from '../utils/consts'; 
import style from '../style/event.module.css'; 
import logo from '../image/logo.png';

const ProfileOrg = observer(() => {
  const { organization } = useContext(Context);
  const navigate = useNavigate();
  const [name, setName] = useState(organization.organization.name || '');
  const [shortDesc, setShortDesc] = useState(organization.organization.short_desc || '');
  const [website, setWebsite] = useState(organization.organization.website || '');

  const handleLogout = async () => {
    try {
      await logoutOrg();
      organization.clearOrganization();
      navigate(MAIN_ROUTE);
    } catch (error) {
      console.error("Ошибка при выходе", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedOrg = await updateProfileOrg(name, shortDesc, website);
      organization.setOrganization(updatedOrg);
      alert('Профиль обновлен!!!');
    } catch (error) {
      console.error("Ошибка при обновлении", error);
      alert('Ошибка при обновлении');
    }
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.sidebar}>
        <img src={logo} alt="Лого" className={style.logo} />
          <ul className={style.menu}>
            <li><Link to={PROFILEORG_ROUTE}>Профиль организации</Link></li>
            <li><Link to={CREATEEVENT_ROUTE}>Добавить мероприятие</Link></li>
            <li><Link to={ACTIVEEVENT_ROUTE}>Активные мероприятия</Link></li>
            <li><Link to={ARCHIVEDEVENT_ROUTE}>Архив мероприятий</Link></li>
            <li><Link to={MAIN_ROUTE}>Назад на карту</Link></li>
            <li><Link to="#" onClick={handleLogout}>Выход</Link></li>
          </ul>
        </div>
        <div className={style.contentWrapper}>
          <div className={style.mainContent}>
            <h1 className={style.profileTitle}>Профиль организации</h1>
            
           <div className={style.formGroup}>
                <label >Название организации</label>
                <input 
                type="text" 
                placeholder="Название" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={style.inputField}
              />
              </div>

              <div className={style.formGroup}>
                <label >Краткое описание</label>
                <textarea 
                placeholder="Краткое описание" 
                value={shortDesc} 
                onChange={(e) => setShortDesc(e.target.value)} 
                className={style.textArea}
              />
              </div>

              <div className={style.formGroup}>
                <label >Вебсайт</label>
                <input 
                type="text" 
                placeholder="Вебсайт" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                className={style.inputField}
              />
              </div>
              <div className={style.formGroup}>
                <button onClick={handleUpdateProfile} className={style.submitButton}>Обновить профиль</button>
              </div> 
            </div>
          </div>
        </div>
      </div>
   
  );
});

export default ProfileOrg;
