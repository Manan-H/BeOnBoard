import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReuseForm from "../reuseForm/ReuseForm";
import fields from "./fields";
import { validateOne, validateAll } from "../../utils/validations";
import { doPut } from "../../utils/request";
import { usersBaseUrl } from "../../utils/apiEndpoints/usersEndpoints";
import { Redirect } from "react-router-dom";
import { socket } from "../../utils/socketHelper/socketIO";
import { EDIT_PROFILE } from "../../utils/socketHelper/events";
import { getUserInfo } from "../../actions/currentUserActions";
import Loading from "../Loading";

const EditMySelf = props => {


  const [inputErrors, setInputErros] = useState({});
  const currentUser = useSelector(state => state.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(currentUser.userInfo);
  const [error, setError] = useState(null);
  const [isRedirect, setIsRedirect] = useState(false);
  const dispatch = useDispatch();



  const submit = e => {
    e.preventDefault();
    setIsLoading(true);
    userInfo.firstLogin = false;
    doPut(`${usersBaseUrl}`, userInfo)
      .then(data => {
        socket.emit(EDIT_PROFILE, {
          changedByAdmin: false,
          ...userInfo
        });
        setIsRedirect(true);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (isRedirect) {
      dispatch(getUserInfo());
    }
  }, [dispatch, isRedirect]);

  let isDisabled = !validateAll(fields, userInfo);

  const changeValue = (name, value, type) => {
    if(!name) {
      return
    }
    
    if (!validateOne(value, type)) {
      setInputErros({ ...inputErrors, [name]: `this field is required` });
    } else {
      setInputErros({ ...inputErrors, [name]: null });
    }

    setUserInfo({ ...userInfo, [name]: value });
  };

  const cancel = () => {
    setIsRedirect(true);
  };

  if (isRedirect) {
    return <Redirect to={`/my-profile`} />;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <Loading isLoading={isLoading}>
      <ReuseForm
        onChange={changeValue}
        onChangeSocial = {changeValue}
        fields={fields}
        userInfo={userInfo}
        userInfoFormErrors={inputErrors}
        onSubmit={submit}
        onCancel={userInfo.firstLogin ? null : cancel}
        isDisabled={isDisabled}
        onChangeTag={changeValue}
        onChangeDate={changeValue}
        onProfilePhotoChange={changeValue}
      />
    </Loading>
  );
};

export default EditMySelf;