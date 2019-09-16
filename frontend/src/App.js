import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "./actions/currentUserActions";
import Layout from "./components/Layout";
import { socketIOWrapper, socket } from "./utils/socketHelper/socketIO";
import Routes from "./components/Routes";
import Loading from './components/Loading';


const App = props => {
  const currentUser = useSelector(state => state.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    socketIOWrapper(dispatch);
    dispatch(getUserInfo());
  }, [dispatch]);

  if (!currentUser.isLoading) {
    socket.emit("user-data", {
      id: currentUser.userInfo._id,
      userType: currentUser.userInfo.userType
    });
  }
  
  return (
      <Loading isLoading={Object.getOwnPropertyNames(currentUser.userInfo).length === 0 && !currentUser.error}>
       {/* <Loading isLoading={currentUser.isLoading}> */}
        <Layout>
          <Routes />
        </Layout>
      </Loading>
    
  )
};

export default App;
