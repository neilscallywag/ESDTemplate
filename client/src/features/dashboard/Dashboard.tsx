import { useEffect } from "react";
import { Routes } from "react-router-dom";

import { useUpdateTitle } from "~features/page-header/title/TitleContext";

// import NewPatient from "./NewPatient";
// import PatientDetail from "./PatientDetail";
// import PatientsList from "./PatientsList";
// import  PrivateRoute  from "~shared/PrivateRoute";
// import Permissions from "~models/Permissions";

const Dashboard = () => {
  // const { permissions } = useSelector((state: RootState) => state.user)
  // every feature needs to have a title set internally
  const updateTitle = useUpdateTitle();
  useEffect(() => {
    updateTitle("Dashboard");
  });

  return (
    <Routes>
      {/* <PrivateRoute
          isAuthenticated={permissions.includes(Permissions.ViewLabs)}
          exact
          path="/labs"
          component={LabRequests}
        />
        <PrivateRoute
          isAuthenticated={permissions.includes(Permissions.RequestLab)}
          exact
          path="/labs/new"
          component={NewLabRequest}
        />
        <PrivateRoute
          isAuthenticated={permissions.includes(Permissions.ViewLab)}
          exact
          path="/labs/:id"
          component={ViewLab}
        /> */}
    </Routes>
  );
};

export default Dashboard;
