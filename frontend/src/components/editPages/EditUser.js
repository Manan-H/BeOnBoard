import React, { useState, useEffect } from "react";
import ReuseForm from "../reuseForm/ReuseForm";
import { Spin } from "antd";
import fields from "./fields";
import { socket } from "../../utils/socketHelper/socketIO";
import { EDIT_PROFILE } from "../../utils/socketHelper/events";
import { validateOne, validateAll } from "../../utils/validations";
import { doGet, doPut } from "../../utils/request";
import { usersBaseUrl } from "../../utils/apiEndpoints/usersEndpoints";
import { Redirect } from "react-router-dom";
import Loading from "../Loading";

const EditUser = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [inputErrors, setInputErros] = useState({});
  const [redirect, setRedirect] = useState(null);
  const { id } = props.match.params;
  
  useEffect(() => {
    // setIsLoading(true);
    doGet(`${usersBaseUrl}/${id}`)
      .then(data => {
        setUserInfo(data[0]);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading || !userInfo) {
    return (
        <Loading>
        {null}
        </Loading> 
    );
  }

  const submit = e => {
    e.preventDefault();
    setIsLoading(true);
    doPut(`${usersBaseUrl}/${id}`, userInfo)
      .then(data => {
        socket.emit(EDIT_PROFILE, {
          changedByAdmin: true,
          ...userInfo,
          userId: id
        });

        setRedirect(`/team/profile/${id}`);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  };

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
    setRedirect("/team");
  };
  if (redirect) {
    return <Redirect to = {redirect} />;
  }
  return (
    <ReuseForm
      onChange={changeValue}
      onChangeSocial = {changeValue}
      fields={fields}
      userInfo={userInfo}
      userInfoFormErrors={inputErrors}
      onSubmit={submit}
      onCancel={cancel}
      isDisabled={isDisabled}
      onChangeTag={changeValue}
      onChangeDate={changeValue}
      onProfilePhotoChange={changeValue}
    />
  );
};

export default EditUser;
