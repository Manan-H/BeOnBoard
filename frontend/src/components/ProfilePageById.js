import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserById } from '../actions/userListActions';
import ProfilePage from './ProfilePage';
import Loading from './Loading';

const ProfilePageById = props => {
  const id = props.match.params.id;

  const dispatch = useDispatch();
  useEffect(() => dispatch(getUserById(id)), [id]);

  const userList = useSelector(state => state.userList);
  const myId = useSelector(state => state.currentUser.userInfo._id);
  const { isLoading, users } = userList;
  const userInfo = users[id];

  return (
    <Loading isLoading={isLoading}>
      {!userInfo ? (
        <h1 style={{ textAlign: 'center' }}>This user doesn't exist anymore</h1>
      ) : (
        <ProfilePage userInfo={userInfo || {}} myId={myId} />
      )}
    </Loading>
  );
};

export default ProfilePageById;
