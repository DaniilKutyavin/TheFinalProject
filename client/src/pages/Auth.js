import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "../style/regLog.module.css"; 
import "../style/style.css";
import { LOGIN_ROUTE, LOGINORG_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, REGISTRATIONORG_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userApi";
import { loginOrg, registrationOrg } from "../http/orgApi"; 
import { observer } from "mobx-react-lite";
import { Context } from "..";

const Auth = observer(() => {
    const { user, organization } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const isReg = location.pathname === REGISTRATION_ROUTE;
    const isLoginORG = location.pathname === LOGINORG_ROUTE;
    const isRegORG = location.pathname === REGISTRATIONORG_ROUTE;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const click = async (event) => {
        event.preventDefault();
        let data;
        try {
            if (isLogin) {
                data = await login(email, password);
                user.setUser(data);
                user.setIsAuth(true);
            } else if (isLoginORG) {
                data = await loginOrg(email, password);
                organization.setOrganization(data);
                organization.setIsAuth(true);
            } else if (isReg) {
                data = await registration(name, email, password);
                user.setUser(data);
                user.setIsAuth(true);
            } else if (isRegORG) {
                data = await registrationOrg(name, email, password);
                organization.setOrganization(data);
                organization.setIsAuth(true);
            }
            navigate(MAIN_ROUTE);
        } catch (e) {
            alert(e.response.data.message);
        }
    };

    const renderForm = (isOrg) => (
        <form onSubmit={click} className={style.form}>
            {!isLogin && !isLoginORG && (
                <div className={style.formField}>
                    <label htmlFor="name" className={style.formfieldlabel}>{isOrg ? 'Имя организации' : 'Имя'}</label>
                    <input 
                        type="text" 
                        name="name" 
                        className={style.formfieldinput} 
                        value={name}
                        onChange={e => setName(e.target.value)} 
                    />
                </div>
            )}
            <div className={style.formField}>
                <label htmlFor="email" className={style.formfieldlabel}>Почта</label>
                <input 
                    type="email" 
                    name="email" 
                    className={style.formfieldinput} 
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                />
            </div>
            <div className={style.formField}>
                <label htmlFor="password" className={style.formfieldlabel}>Пароль</label>
                <input 
                    type="password" 
                    name="password" 
                    className={style.formfieldinput} 
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                />
            </div>
            <div className={style.formField} >
                <button type="submit" className={style.formbutton}>
                    {isLogin || isLoginORG ? 'Войти' : 'Зарегистрироваться'}
                </button>
                <div className="mt-3">
                    {isLogin || isLoginORG ? (
                        <div>
                            Нет аккаунта? <Link to={isLogin ? REGISTRATION_ROUTE : REGISTRATIONORG_ROUTE}>Зарегистрируйся!</Link>
                        </div>
                    ) : (
                        <div>
                            Есть аккаунт? <Link to={isReg ? LOGIN_ROUTE : LOGINORG_ROUTE}>Войдите!</Link>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );

    return (
        <div className={style.container}>
            <p id={style.kal1} className={style.kaleidoscope}>КАЛЕЙ</p>
            <p id={style.kal2}  className={style.kaleidoscope}>ДОСКОП</p>
            <div className={style.logo}></div>
            <div className={style.logincontainer}>
                <h2>{isLogin || isLoginORG ? 'Авторизация' : 'Регистрация'}</h2>
                {renderForm(isLoginORG || isRegORG)}
            </div>
        </div>
    );
});

export default Auth;
