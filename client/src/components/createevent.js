import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Context } from "..";
import { logout } from "../http/userApi";
import { logoutOrg } from "../http/orgApi";
import { createEvent } from "../http/eventApi";
import { MAIN_ROUTE, ACTIVEEVENT_ROUTE, ARCHIVEDEVENT_ROUTE, CREATEEVENT_ROUTE, PROFILEORG_ROUTE } from '../utils/consts';
import style from '../style/event.module.css';
import DG from '2gis-maps';
import debounce from 'lodash.debounce';
import logo from '../image/logo.png';

const CreateEvent = () => {
  const { user, organization, event } = useContext(Context);
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      await event.loadTypes();
      setEventTypes(event.types);
    };

    fetchEventTypes();
  }, [event]);

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

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const newMapInstance = DG.map(mapContainerRef.current, {
        center: [57.146122, 65.57817],
        zoom: 13,
        key: process.env.API_2GIS,
      });

      newMapInstance.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setCoordinates(`${lat}, ${lng}`);

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const newMarker = DG.marker([lat, lng]).addTo(newMapInstance);
          markerRef.current = newMarker;
        }

        const newAddress = await getAddressFromCoordinates(lat, lng);
        setAddress(newAddress || ''); 
      });

      mapInstanceRef.current = newMapInstance;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const getAddressFromCoordinates = async (lat, lng) => {
    const apiKey = process.env.API_2GIS;
    const response = await fetch(`https://catalog.api.2gis.com/3.0/items/geocode?lat=${lat}&lon=${lng}&fields=items.address&key=${apiKey}`);
    const data = await response.json();
    if (data.result && data.result.items && data.result.items.length > 0) {
      return data.result.items[0].address_name;
    } else {
      return '';
    }
  };

  const handleAddressChange = async (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    if (newAddress.length > 2) {
      debouncedFetchSuggestions(newAddress);
    } else {
      setSuggestions([]);
    }
  };

  const fetchSuggestions = async (query) => {
    const apiKey = process.env.API_2GIS;
    const response = await fetch(`https://catalog.api.2gis.com/3.0/items/geocode?q=${encodeURIComponent(query)}&fields=items.point,items.full_name&key=${apiKey}`);
    const data = await response.json();
    if (data.result && data.result.items && data.result.items.length > 0) {
      setSuggestions(data.result.items);
    } else {
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  const handleSuggestionClick = (item) => {
    setAddress(item.full_name);
    setCoordinates(`${item.point.lat}, ${item.point.lon}`);
    setSuggestions([]);

    if (markerRef.current) {
      markerRef.current.setLatLng([item.point.lat, item.point.lon]);
    } else {
      const newMarker = DG.marker([item.point.lat, item.point.lon]).addTo(mapInstanceRef.current);
      markerRef.current = newMarker;
    }

    mapInstanceRef.current.setView([item.point.lat, item.point.lon], 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo', file); 
    formData.append('title', e.target.elements.eventName.value);
    formData.append('description', e.target.elements.description.value);
    formData.append('capacity', e.target.elements.capacity.value);
    formData.append('capacityAll', e.target.elements.capacity.value);
    formData.append('price', parseInt(e.target.elements.price.value));
    formData.append('date_time', e.target.elements.eventDate.value);
    formData.append('locate', address);
    formData.append('coordinates', coordinates);
    formData.append('time_start', e.target.elements.eventTimestart.value);
    formData.append('time_end', e.target.elements.eventTimeend.value);
    formData.append('typeId', e.target.elements.eventType.value);
    formData.append('organizerId', organization.organization.id);

    try {
      await createEvent(formData);
      navigate(ACTIVEEVENT_ROUTE);
    } catch (error) {
      console.error("Failed to create event", error);
    }
  };

  const selectFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
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
            <h1>Добавить мероприятие</h1>
            <form onSubmit={handleSubmit}>
              <div className={style.formGroup}>
                <label htmlFor="photo">Изображение</label>
                <input type="file" id="photo" name="photo" onChange={selectFile} />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="eventName">Название мероприятия</label>
                <input type="text" id="eventName" name="eventName" />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="eventType">Тип мероприятия</label>
                <select id="eventType" name="eventType">
                  {eventTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.type_name}</option>
                  ))}
                </select>
              </div>
              <div className={style.formGroup}>
                <label htmlFor="eventAddress">Адрес мероприятия</label>
                <input type="text" id="eventAddress" name="eventAddress" value={address} onChange={handleAddressChange} />
                <div className={style.suggestions}>
                  {suggestions.map((item, index) => (
                    <div key={index} className={style.suggestionItem} onClick={() => handleSuggestionClick(item)}>
                      {item.full_name}
                    </div>
                  ))}
                </div>
              </div>
              <div className={style.formGroup}>
                <label htmlFor="coordinates">Координаты</label>
                <input type="text" id="coordinates" name="coordinates" value={coordinates} readOnly />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="description">Описание</label>
                <textarea id="description" name="description"></textarea>
              </div>
              <div className={style.formGroup}>
                <label htmlFor="capacity">Количество участников</label>
                <input type="number" id="capacity" name="capacity" />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="price">Цена</label>
                <input type="number" id="price" name="price" />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="eventDate">Дата</label>
                <br /><input type="date" id="eventDate" name="eventDate" required />
              </div>
              <div>
                <label htmlFor="eventTime" className={style.time}>Время</label>
                <br /><input type="time" className={style.time} id="eventTimestart" name="eventTimestart" required /><span id={style.tire}> - </span><input className={style.time} type="time" id="eventTimeend" name="eventTimeend" required />
              </div>
              <div className={style.formGroup}>
                <button type="submit" className={style.submitButton}>Добавить мероприятие</button>
              </div>
            </form>
          </div>
          <div ref={mapContainerRef} className={style.map} />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
