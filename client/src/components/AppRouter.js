import React, { useContext } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes";
import { Context } from "../index";

const AppRouter = () => {
    const { user, organization } = useContext(Context);
    console.log(user);
    console.log(organization);

    return (
        <Routes>
            {user.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}

            {organization.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}

            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} />
            )}

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRouter;
