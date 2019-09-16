import React, { useState, useEffect } from "react";
import { notification, Input, List, Modal } from "antd";
import Image from "./Image";
import Upload from "./Upload";
import doUpload from "../utils/doUpload";

const style = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "500px",
  alignItems: "center",
  margin: "auto"
};

const PhotoUpload = props => {
  const { showUpload, setShowUpload, getImages } = props;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [captions, setCaptions] = useState({});

  const reset = () => {
    setError("");
    setIsLoading(false);
    setPreviews([]);
    setCaptions({});
    setShowUpload(false);
  };

  useEffect(() => {
    error && notification.error({ message: "Error", description: error });
  }, [error]);

  function submit() {
    setIsLoading(true);

    const formData = new FormData();
    previews.forEach(preview => {
      formData.append("id", preview.id);
      formData.append("data", preview.data);
      formData.append("caption", captions[preview.id] || "");
    });

    doUpload("images", formData)
      .then(data => {
        notification.info({
          message: "Success!",
          description: ` ${data.createdImages.length} images saved to gallery`
        });
        reset();
        getImages();
      })
      .catch(err => {
        setError("Upload failed");
        notification.error({
          message: "Oops! Something went wrong!",
          description: err.message
        });
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <Modal
      visible={showUpload}
      onCancel={() => {
        reset();
        setShowUpload(false);
      }}
      onOk={submit}
      okText="Save images to Gallery"
      destroyOnClose={true}
      confirmLoading={isLoading}
    >
      <div className="PhotoUpload" style={style}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={previews}
          locale={{ emptyText: "No Images Chosen" }}
          renderItem={preview => (
            <List.Item key={preview.id}>
              <Image src={preview.img} style={{ maxWidth: "300px" }} />
              <p style={{ marginTop: "25px", textAlign: "center" }}>
                Add caption
              </p>
              <Input.TextArea
                style={{ resize: "none" }}
                autosize={true}
                value={captions[preview.id] || ""}
                onChange={e => {
                  setCaptions({ ...captions, [preview.id]: e.target.value });
                }}
              />
              <p
                onClick={preview.delete}
                style={{
                  color: "red",
                  cursor: "pointer",
                  marginTop: "25px",
                  textAlign: "center"
                }}
              >
                {" "}
                delete image{" "}
              </p>
            </List.Item>
          )}
        />

        <Upload
          multiple={true}
          isLoading={isLoading}
          handlePreviews={previews => setPreviews(previews)}
          accept="image"
        />
      </div>
    </Modal>
  );
};

export default PhotoUpload;
