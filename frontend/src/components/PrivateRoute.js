import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = props => {
  const currentUser = useSelector(state => state.currentUser);
  const { type, component: Component, path, ...otherProps } = props;
  const userType = currentUser.userInfo.userType || 0;
  const firstLogin = currentUser.userInfo.firstLogin;
  const allowedTypes = [].concat(type);

  return (
    <Route
      path={path}
      render={props => {
        if (firstLogin && path !== "/complete-registration") {
          return <Redirect to="/complete-registration" />;
        }

        if (!allowedTypes.includes(userType)) {
          return <Redirect to="/" />;
        }

        return <Component {...props} {...otherProps} />;
      }}
    />
  );
};

export default PrivateRoute;
