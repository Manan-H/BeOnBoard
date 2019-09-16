import React from 'react';
import { useSelector } from 'react-redux';
import ProfilePage from './ProfilePage';

const MyProfilePage = props => {
  const userInfo = useSelector(state => state.currentUser.userInfo);  

  return <ProfilePage userInfo={userInfo} />
}

export default MyProfilePage;