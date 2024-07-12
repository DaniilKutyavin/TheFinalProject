import React, { useContext } from 'react';
import CreateEvent from '../components/createevent';
import ProfileOrg from '../components/profileorg';
import ProfileUser from '../components/profileUser';
import ActiveEvent from '../components/activeEvent';
import ArchivedEvent from '../components/archivedEvent';
import { useLocation } from 'react-router-dom';
import { Context } from '../index';
import { ACTIVEEVENT_ROUTE, ARCHIVEDEVENT_ROUTE, CREATEEVENT_ROUTE, PROFILEORG_ROUTE, PROFILEUSER_ROUTE } from '../utils/consts';

const PersonalAccount = () => {
  const location = useLocation();
  const { user, organization } = useContext(Context);


  const renderComponent = () => {
    if (organization.isAuth) {
      switch (location.pathname) {
        case ACTIVEEVENT_ROUTE:
          return <ActiveEvent />;
        case CREATEEVENT_ROUTE:
          return <CreateEvent />;
        case ARCHIVEDEVENT_ROUTE:
          return <ArchivedEvent />;
        case PROFILEORG_ROUTE:
          return <ProfileOrg />;
        default:
          return null; 
      }
    } else if (user.isAuth) {
      switch (location.pathname) {
     
        case PROFILEUSER_ROUTE:  
          return <ProfileUser/>;
    
        default:
          return null; 
      }
    } else {
      return null; 
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default PersonalAccount;
