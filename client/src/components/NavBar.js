import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import style from "../style/navbar.module.css";
import { LOGIN_ROUTE, LOGINORG_ROUTE, PROFILEORG_ROUTE, PROFILEUSER_ROUTE, REGISTRATION_ROUTE, REGISTRATIONORG_ROUTE } from "../utils/consts";

const NavBar = observer(() => {
  const { user, organization } = useContext(Context);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    if (user.isAuth) {
      navigate(PROFILEUSER_ROUTE);
    }
    else if (organization.isAuth) {
      navigate(PROFILEORG_ROUTE);
    } else {
      handleToggleDropdown();
    }
  };


  return (
    <div>
      <div id={style.personalPageButton} onClick={handleProfileClick}>
        <img
          src="https://cs13.pikabu.ru/avatars/5580/x5580240-656074953.png"
          alt="User"
          id={style.userImage}
          className={style.userImage}
        />
      </div>
      {isOpen && (!user.isAuth || !organization.isAuth) && (
        <div className={style.dropdown} ref={dropdownRef}>
          <Link to={REGISTRATION_ROUTE}>Регистрация</Link>
          <Link to={LOGIN_ROUTE}>Авторизация</Link>
          <Link to={REGISTRATIONORG_ROUTE}>Регистрация организации</Link>
          <Link to={LOGINORG_ROUTE}>Авторизация организации</Link>
        </div>
      )}
    </div>
  );
});

export default NavBar;
