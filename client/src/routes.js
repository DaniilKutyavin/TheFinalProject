import { Component } from "react";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Event from "./pages/Event";
import Main from "./pages/Main";
import PersonalAccount from "./pages/PersonalAccount";
import { ACTIVEEVENT_ROUTE, ADMIN_ROUTE, ARCHIVEDEVENT_ROUTE, CREATEEVENT_ROUTE, EVENT_ROUTE, LOGIN_ROUTE, LOGINORG_ROUTE, MAIN_ROUTE, PROFILEORG_ROUTE, PROFILEUSER_ROUTE, REGISTRATION_ROUTE, REGISTRATIONORG_ROUTE } from "./utils/consts";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },

    {
        path: PROFILEORG_ROUTE,
        Component: PersonalAccount
    },

    {
        path: ACTIVEEVENT_ROUTE,
        Component: PersonalAccount
    },

    {
        path: ARCHIVEDEVENT_ROUTE,
        Component: PersonalAccount
    },

    {
        path: CREATEEVENT_ROUTE,
        Component: PersonalAccount
    },

    {
        path: PROFILEUSER_ROUTE,
        Component: PersonalAccount
    },
]

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Main
    },

    {
        path: LOGIN_ROUTE,
        Component: Auth
    },

    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },

    {
        path: LOGINORG_ROUTE,
        Component: Auth
    },

    {
        path: REGISTRATIONORG_ROUTE,
        Component: Auth
    },

    {
        path: EVENT_ROUTE + '/:id',
        Component: Event
    },

]