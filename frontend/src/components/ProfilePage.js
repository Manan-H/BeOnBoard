import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Divider, Modal, Typography, Button, Tag } from "antd";
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import {
  faAt,
  faUserGraduate,
  faBirthdayCake,
  faMobileAlt
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";

import MiniGallery from "./MiniGallery";
import Loading from "./Loading";

const ProfilePage = props => {
  const currentUser = useSelector(state => state.currentUser);
  const { userInfo } = props;
  const { Text } = Typography;

  useEffect(() => {
    setState({
      src: userInfo.profPic,
      visible: false
    });
  }, [props]);

  const [state, setState] = useState({
    src: userInfo.profPic,
    visible: false
  });

  const [showMiniGallery, setShowMiniGallery] = useState(false);

  const changeThumbSrc = thumbSrc => {
    setState({
      src: thumbSrc,
      visible: false
    });
  };
  const showModal = () => {
    setState({
      ...state,
      visible: true
    });
  };
  const handleCancel = () => {
    setState({
      ...state,
      visible: false
    });
  };

  const imgThumbStyle = {
    width: "60px",
    height: "60px"
  };

  return (
    <Loading isLoading={currentUser.isLoading}>
      <div className="ProfilePage">
        {!props.myId ? (
          <Link to={"/edit"}>
            <Button
              type="dashed"
              icon="edit"
              size={"large"}
              style={{ position: "absolute", right: "1%" }}
            />
          </Link>
        ) : null}
        <Row>
          <Col sm={{ span: 24 }} xl={{ span: 10 }}>
            <img
              alt="Profile"
              src={
                state.src ||
                "https://www.nelson-chambers.co.uk/front/images/default-user.jpg"
              }
              className="profilePic"
              onClick={showModal}
            />
            ​
            <Modal
              style={{}}
              visible={state.visible}
              onCancel={handleCancel}
              footer={[null, null]}
            >
              <img
                src={
                  state.src ||
                  "https://www.nelson-chambers.co.uk/front/images/default-user.jpg"
                }
                alt="Profile"
                style={{
                  width: "300px",
                  margin: "10px auto",
                  display: "block"
                }}
              />
            </Modal>
            <div className="profilePhotosWrapper">
            <div className="profilePhotosContainer">
              <Card
                bordered={false}
                style={{
                  width: 80,
                  height: 80,
                  padding: 7,
                  display: "inline-block"
                }}
                hoverable
                cover={
                  <img
                    alt={userInfo.name}
                    src={
                      userInfo.profPic ||
                      "https://www.nelson-chambers.co.uk/front/images/default-user.jpg"
                    }
                    style={imgThumbStyle}
                  />
                }
                onClick={() => {
                  changeThumbSrc(userInfo.profPic);
                }}
              />
              {(userInfo.photos || []).map((photo, i) => {
                if (photo) {
                  return (
                    <div key={`photo ${i}`}>
                      <Card
                        bordered={false}
                        style={{
                          width: 80,
                          height: 80,
                          padding: 10,
                          display: "inline-block"
                        }}
                        hoverable
                        cover={
                          <img
                            alt={userInfo.name}
                            src={photo}
                            style={imgThumbStyle}
                          />
                        }
                        onClick={() => {
                          changeThumbSrc(photo);
                        }}
                      />
                    </div>
                  );
                } else return null;
              })}
</div>
{!props.myId ? (

              <Button
                onClick={() => setShowMiniGallery(true)}
                type="dashed"
                icon={
                 "plus"
                }
                size={"default"}
                style={{ marginLeft: "7px"}}
              />) : null}
              </div>
            
            <MiniGallery
              showMiniGallery={showMiniGallery}
              setShowMiniGallery={setShowMiniGallery}
              photos={userInfo.photos}
              limit={3}
            />
          </Col>
          <Col sm={{ span: 24 }} xl={{ span: 14 }}>
            <Col xs={{ span: 24 }} style={{ margin: "0 0 30px" }}>
              <section>
                <h1 style={{ color: "black", fontSize: "25px"}}>
                  {userInfo.name} {userInfo.surname}
                </h1>
                <h3
                  style={{
                    color: "#36b3a8",
                    fontSize: "19px",
                    margin: "-7px 0 15px"
                  }}
                >
                  {userInfo.position}
                </h3>
                <div>
                  {(userInfo.social || []).map((socialNet, i) => {
                    if (socialNet) {
                      return (
                        <a href={socialNet.url} key={`Social Network ${i}`}>
                          {(() => {
                            switch (socialNet.media) {
                              case "facebook":
                                return (
                                  <FontAwesomeIcon
                                    icon={faFacebook}
                                    className="socialIconProfile"
                                    style={{ color: "#3a5896" }}
                                  />
                                );
                              case "instagram":
                                return (
                                  <FontAwesomeIcon
                                    icon={faInstagram}
                                    className="socialIconProfile"
                                    style={{ color: "#b5328d" }}
                                  />
                                );
                              case "twitter":
                                return (
                                  <FontAwesomeIcon
                                    icon={faTwitter}
                                    className="socialIconProfile"
                                  />
                                );
                              case "linkedin":
                                return (
                                  <FontAwesomeIcon
                                    icon={faLinkedin}
                                    className="socialIconProfile"
                                  />
                                );
                              default:
                                return;
                            }
                          })()}
                        </a>
                      );
                    } else {
                      return console.log("Social network url missing");
                    }
                  })}
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <div className="iconBackground">
                    <FontAwesomeIcon
                      icon={faUserGraduate}
                      style={{ position: "absolute", right: "6px", top: "6px" }}
                    />
                  </div>
                  <b>Education:</b> {userInfo.education}
                </div>
                <div style={{ marginBottom: "5px" }}>
                  <div className="iconBackground">
                    <FontAwesomeIcon
                      icon={faAt}
                      style={{ position: "absolute", right: "6px", top: "6px" }}
                    />
                  </div>
                  <b>E-mail: </b>
                  <a
                    href={`mailto:${
                      userInfo.email
                    }?subject = Feedback&body = Message`}
                  >
                    {userInfo.email}
                  </a>
                </div>
                <div style={{ marginBottom: "5px" }}>
                  <div className="iconBackground">
                    <FontAwesomeIcon
                      icon={faBirthdayCake}
                      style={{ position: "absolute", right: "6px", top: "6px" }}
                    />
                  </div>
                  <b>Birthday: </b>{" "}
                  {userInfo.birthday
                    ? moment(userInfo.birthday).format("DD-MM-YYYY")
                    : ""}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <div className="iconBackground">
                    <FontAwesomeIcon
                      icon={faMobileAlt}
                      style={{ position: "absolute", right: "8px", top: "6px" }}
                    />
                  </div>
                  <b>Phone: </b>
                  <a href={`tel:${userInfo.phoneNumber}`}>
                    {userInfo.phoneNumber}
                  </a>
                </div>
              </section>
            </Col>
            ​
            <Col xs={{ span: 24 }} className="profileSectionContainer">
              <section>
                <Divider orientation="left">
                  <h4 style={{ color: "#36b3a8", margin: 0 }}>
                    Professional Skills
                  </h4>
                </Divider>

                {userInfo.professionalSkills &&
                userInfo.professionalSkills.length ? (
                  userInfo.professionalSkills.map((skill, index) => {
                    return <Tag key={`Skill ${index}`}>{skill}</Tag>;
                  })
                ) : (
                  <Text
                    strong
                    style={{
                      padding: "0px 25px",
                      width: "100%"
                    }}
                  >
                    I'll share it shortly
                  </Text>
                )}
              </section>
            </Col>
            <Col xs={{ span: 24 }} className="profileSectionContainer">
              <section>
                <Divider orientation="left">
                  <h4 style={{ color: "#36b3a8", margin: 0 }}>
                    Hobbies & Interests
                  </h4>
                </Divider>
                {userInfo.hobbies && userInfo.hobbies.length ? (
                  userInfo.hobbies.map((hobby, index) => {
                    return <Tag key={`Hobby ${index}`}>{hobby}</Tag>;
                  })
                ) : (
                  <Text
                    strong
                    style={{
                      padding: "0px 25px",
                      width: "100%"
                    }}
                  >
                    I'll share it shortly
                  </Text>
                )}
              </section>
            </Col>
            <Col xs={{ span: 24 }} className="profileSectionContainer">
              <section>
                <Divider orientation="left">
                  <h4 style={{ color: "#36b3a8", margin: 0 }}>Fun Facts</h4>
                </Divider>
                <Text
                  strong
                  style={{
                    padding: "0px 25px",
                    width: "100%"
                  }}
                >
                  {userInfo.shortInfo
                    ? userInfo.shortInfo
                    : "I'll share it shortly"}
                </Text>
              </section>
            </Col>
          </Col>
        </Row>
      </div>
    </Loading>
  );
};

export default ProfilePage;
