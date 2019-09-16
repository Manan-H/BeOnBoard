import socketIOClient from "socket.io-client";
import { Icon, notification } from "antd";
import React from "react";
import { NEW_NOTIFICATION } from "./events";
import {updateNotifications} from "../../actions/currentUserActions";

const { REACT_APP_API_ROOT } = process.env;
const io = socketIOClient(REACT_APP_API_ROOT);

export const socketIOWrapper = dispatch => {
  io.on(NEW_NOTIFICATION, notificationData => {
    notification.config({
      placement: 'bottomRight',
      bottom: 50,
      duration: 5,
    });

    notification.open({
      message: `${notificationData.name} ${notificationData.surname} ${notificationData.message}`,
      description: "",
      icon: <Icon type="smile" style={{ color: "#108ee9" }} />
    });
    dispatch(updateNotifications(true));
  });
};

export const socket = io;
