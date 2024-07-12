import React, { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import DG from '2gis-maps';
import style from "../style/Main.module.css";
import city from '../image/tyumen.jpg';
import logo from '../image/logo.png';
import NavBar from "../components/NavBar";
import { Context } from ".."; 
import { EVENT_ROUTE } from "../utils/consts";

const Main = observer(() => {
  const { event } = useContext(Context);
  const mapRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    event.loadTypes();
    event.loadActiveAllEvents();
  }, [event]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = DG.map('map', {
        center: [57.146122, 65.57817],
        zoom: 13,
        key: process.env.API_2GIS,
      });
    }

    const addMarkers = (events) => {
      events.forEach(evt => {
        const [lat, lng] = evt.coordinates.split(',').map(coord => parseFloat(coord));
        const marker = DG.marker([lat, lng]).addTo(mapRef.current);
        marker.bindPopup(`
          <a href="${EVENT_ROUTE}/${evt.id}" class="${style.popupTitle}">
          <div class="${style.popup}">
            <img src="${process.env.REACT_APP_API_URL + evt.photo}" alt="${evt.title}" class="${style.popupImage}" />
            <div class="${style.popupContent}">
                <p>${evt.title} </p>
              <p><strong>Дата:</strong> ${evt.date_time}</p>
              <p><strong>Время:</strong> ${evt.time_start} - ${evt.time_end}</p>
            </div>
          </div>
          </a>
        `);
      });
    };

    const filteredEvents = event.events.filter(evt => {
      const matchesCategory = selectedCategory ? evt.typeId === selectedCategory : true;
      const matchesSearch = searchQuery ? evt.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const matchesDate = filterDate ? evt.date_time.split(' ')[0] === filterDate : true;
      return matchesCategory && matchesSearch && matchesDate;
    });


    mapRef.current.eachLayer((layer) => {
      if (layer instanceof DG.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    addMarkers(filteredEvents);

  }, [event.events, selectedCategory, searchQuery, filterDate]);

  const handleCategoryClick = (typeId) => {
    setSelectedCategory(typeId);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setFilterDate('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const getCurrentDay = (date) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000); 
    return () => clearInterval(timer);
  }, []);

  const getEventCountByType = (typeId) => {
    return event.events.filter(evt => evt.typeId === typeId).length;
  };

  return (
    <>
      <NavBar />
      <div className={style.container}>
        <div className={style.sidebar}>
          <div
            className={style.sidebarhead}
            style={{
              backgroundImage: `url(${city})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className={style.topofsidebar}>
              <div className={style.logo}>
                <img src={logo} alt="Логотип" className={style['logo-img']} />
              </div>
              <div className={style.city}>Тюмень</div>
              <div className={style.date}>{`${currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}, ${getCurrentDay(currentDate)}`}</div>
            </div>

            <input
              type="text"
              placeholder="Поиск (по мероприятиям)"
              className={style.search}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <input
              type="date"
              className={style.search}
              value={filterDate}
              onChange={handleDateChange}
            />
            <button className={style['reset-filters']} onClick={handleResetFilters}>Сбросить фильтры</button>
            <div className={style['search-results']}></div>
          </div>
          <div className={style['category-list']}>
            <div className={style['types-list']}>
              {event.types.map(type => (
                <React.Fragment key={type.id}>
                  <div 
                    className={style['event-type']} 
                    data-type={type.type_name} 
                    onClick={() => handleCategoryClick(type.id)}
                  >
                    <div className={style['event-type-content']}>
                      <div className={style.circle} style={{ background: `linear-gradient(to right, ${type.type_color})` }}>
                        <span className={style['event-type-count']}>{getEventCountByType(type.id)}</span>
                      </div>
                      <p className={style['event-type-name']}>{type.type_name}</p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className={style['events-list']}></div>
          </div>
        </div>
        <div id="map" className={style.map}></div>
      </div>
    </>
  );
});

export default Main;
