import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from './index';
import { check as checkUser } from './http/userApi';
import { checkOrg } from './http/orgApi';

const App = observer(() => {
  const { user, organization } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuthentication = async () => {
      const isUserAuth = JSON.parse(localStorage.getItem('userIsAuth'));
      const isOrgAuth = JSON.parse(localStorage.getItem('orgIsAuth'));

      if (isUserAuth) {
        try {
          const userData = await checkUser();
          user.setUser(userData);
          user.setIsAuth(true);
        } catch (userError) {
          console.error("Failed to refresh user token", userError);
          user.clearUser();
        }
      }

      if (isOrgAuth) {
        try {
          const orgData = await checkOrg();
          organization.setOrganization(orgData);
          organization.setIsAuth(true);
        } catch (orgError) {
          console.error("Failed to refresh organization token", orgError);
          organization.clearOrganization();
        }
      }

      setLoading(false);
    };

    verifyAuthentication();
  }, [user, organization]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
