import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {Modal, Button, notification} from "antd";
import Upload from "./Upload";
import Image from "./Image";

import { updatePhotos } from "../actions/currentUserActions";
import doUpload from "../utils/doUpload";

const margin = {
  marginBottom: "16px"
};

const flexContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "flex-end"
};

const photoContainer = {
  ...margin,
  textAlign: "center",
  width: "30%",
  padding: "5px"
};

const MiniGallery = props => {
  const { showMiniGallery, setShowMiniGallery } = props;

  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState(new FormData());

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setPhotos(props.photos || []);
  }, [showMiniGallery]);

  const removePhoto = index => setPhotos(photos.filter((ph, i) => i !== index));

  const reset = () => {
    setPhotos([]);
    setPreviews([]);
    setFormData(new FormData());
    setIsLoading(false);
  };

  const submit = () => {
    photos.forEach(photo => {
      formData.append("oldPhotos", photo);
    });

    setIsLoading(true);
    doUpload("users/photos", formData, "put")
      .then(data => dispatch(updatePhotos(data)))
      .catch(err => {
        notification.error({
          message: 'Oops! Something went wrong!',
          description: err.message,
        });
      })
      .finally(() => {
        reset();
        setShowMiniGallery(false);
      });
  };

  return (
    <Modal
      visible={showMiniGallery}
      onCancel={() => {
        reset();
        setShowMiniGallery(false);
      }}
      onOk={submit}
      okText="Save and Exit"
      destroyOnClose={true}
      confirmLoading={isLoading}
      style={{ height: "70%" }}
    >
      <div className="MiniGallery">
        <Upload
          isLoading={isLoading}
          multiple={true}
          accept="image"
          handlePreviews={previews => setPreviews(previews)}
          handleFormData={formData => formData && setFormData(formData)}
        />
        <div style={flexContainer}>
          {photos.map((photo, i) => (
            <div style={photoContainer} key={`pht${i}`}>
              <Image
                src={photo}
                style={{ ...margin, objectFit: "contain", width: "100%" }}
              />
              <div style={{ width: "100%" }}>
                <Button type="danger" onClick={() => removePhoto(i)}>
                  remove
                </Button>
              </div>
            </div>
          ))}
          {previews.map(preview => (
            <div style={photoContainer} key={preview.id}>
              <Image
                key={preview.id}
                src={preview.img}
                style={{ ...margin, objectFit: "contain", width: "100%" }}
              />
              <div>
                <Button type="danger" onClick={preview.delete}>
                  remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default MiniGallery;