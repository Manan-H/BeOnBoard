import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Drawer, Popover, Badge } from "antd";
import { updateNotificationsStatus } from "../utils/apiEndpoints/usersEndpoints";
import { doPut } from "../utils/request";
import { updateNotifications } from "../actions/currentUserActions";
import "antd/dist/antd.css";

const Notification = props => {
  const dispatch = useDispatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const notifications = useSelector(
    state => state.currentUser.userInfo.notifications || []
  );
  const unseen = notifications.filter(notif => !notif.seen);
  const latestUnseen = unseen[0] || {
    title: "No News",
    content: "We'll let you know"
  };

  const style = {
    height: props.height,
    float: "left",
    display: "flex",
    alignItems: "center",
    padding: "0px 20px"
  };

  const popoverProps = {
    placement: "bottom",
    visible: isPopoverOpen,
    title: latestUnseen.title,
    content: latestUnseen.text
  };

  const buttonProps = {
    size: "large",
    icon: "notification",
    style: { minWidth: "50px" },
    onClick: () => {
      setIsPopoverOpen(false);
      setIsDrawerOpen(true);
    },
    onMouseOver: !props.isScreenSmall ? () => setIsPopoverOpen(true) : null,
    onMouseOut: !props.isScreenSmall ? () => setIsPopoverOpen(false) : null
  };

  return (
    <div className="Notification" style={style}>
      <Popover {...popoverProps}>
        <Badge
          count={unseen.length}
          style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
        >
          <Button {...buttonProps}>
            {!props.isScreenSmall && "Notifications"}
          </Button>
        </Badge>
      </Popover>

      <Drawer
        title="Notifications"
        placement="left"
        closable={true}
        onClose={() => {
          setIsDrawerOpen(false);

          doPut(updateNotificationsStatus)
            .then(() => {
              dispatch(updateNotifications());
            })
            .catch(err => {
              console.log(err);
            });
        }}
        visible={isDrawerOpen}
      >
        {notifications.map((notif,i) => (
          <div key={`n${i}`}>
            <p style={{ fontWeight: !notif.seen ? "bold" : "normal" }}>
              {notif.text}
            </p>
          </div>
        ))}
      </Drawer>
    </div>
  );
};

export default Notification;
