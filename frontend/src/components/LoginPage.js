import React from "react";
import { Button, Typography } from "antd";
import video from "../videos/oneDay.mp4";
import videoPoster from "../images/videoPoster.JPG";

const { Title } = Typography;
const { REACT_APP_API_ROOT, REACT_APP_VERSION } = process.env;

const LoginPage = props => {
  return (
    <div>
    <div className="loginPageWrapper">
      <div className="loginPageContent">
        <Title className="loginPageTitle">
          Be On Board
        </Title>
        <Button
          type="primary"
          size="large"
          onClick={() =>
            window.location.replace(
              `${REACT_APP_API_ROOT}/api/${REACT_APP_VERSION}/auth/google/redirect`
            )
          }
          style={{ background: "#36b3a8", border: "none", boxShadow: "2px 2px #00000026" }}
          icon="google"
        >
          Login via Google
        </Button>
      </div>
      <figure className="loginPageBackground">
        <video
          className="loginVideo"
          autoPlay={true}
          muted={true}
          loop
          width="100%"
          height="auto"
          poster={videoPoster}
        >
          <source src={video} type="video/mp4" />
        </video>
      </figure>
    </div>
    <div className="loginPageAbout">
    <p>
    Simply Technologies is a premier software design and development
    company, specialized in web, mobile applications, web services and
    conversational chatbots design and development. 
  </p>
  <p>
    Founded in the beginning
    of 2011 by two entrepreneurs with software engineering background Simply
    Technologies successfully designed and developed highly performing apps
    and provided the most innovative solutions to its customers.
  </p>
  </div>
  </div>
  );
};

export default LoginPage;
