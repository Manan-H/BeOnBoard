import React, { useState, useEffect } from "react";
import { default as PhotoGrid } from "react-grid-gallery";
import { useSelector } from "react-redux";
import { Button, notification } from "antd";
import Loading from "./Loading";
import { doGet, doPut } from "../utils/request";
import PhotoUpload from "./PhotoUpload";

const Gallery = props => {
  const userType = useSelector(state => state.currentUser.userInfo.userType);

  const [images, setImages] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => getImages(), []);

  const getImages = () => {
    setIsLoading(true);

    doGet("images")
      .then(data =>
        setImages(
          data.map(image => {
            const preCaption = image.uploader
              ? `By ${image.uploader.name} ${image.uploader.surname}: `
              : "";

            return {
              ...image,
              thumbnail: image.src,
              caption: `${preCaption}${image.caption}`
            };
          })
        )
      )
      .catch(err => {
        notification.error({
          message: "Oops! Something went wrong!",
          description: err.message
        });
      })
      .finally(() => setIsLoading(false));
  };

  const selectImage = id => {
    setImages(
      images.map(image =>
        image._id === id ? { ...image, isSelected: !image.isSelected } : image
      )
    );
  };

  const deleteSelectedImages = () => {
    const selectedIds = images
      .filter(image => image.isSelected)
      .map(image => image._id);
    setIsLoading(true);
    doPut("images/delete", selectedIds)
      .then(() => {
        notification.success({
          message: "Success",
          description: "Images deleted successfully"
        });
        getImages();
      })
      .catch(err => {
        notification.error({
          message: "Error",
          description: "Failed to delete images"
        });
        setIsLoading(false);
      });
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="Gallery">
        <div >
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: 0 }}>Gallery</h1>
            <p>Here you will find various snapshots from Simply's life</p>
            {!images.length && (
              <p>This place will be packed with photos soon enough!</p>
            )}
          </div>

          {userType === 1 ? (
            <div style={{ margin: "16px 0px" }}>
              <Button onClick={() => setShowUpload(true)} type="primary">
                {" "}
                Upload Images{" "}
              </Button>
              <PhotoUpload
                showUpload={showUpload}
                setShowUpload={setShowUpload}
                getImages={getImages}
              />
              {images.find(image => image.isSelected) && (
                <Button
                  style={{ marginLeft: "16px" }}
                  type="danger"
                  onClick={deleteSelectedImages}
                >
                  Delete selected images
                </Button>
              )}
            </div>
          ) : null}
          <PhotoGrid
            images={images}
            onSelectImage={(index, image) => selectImage(image._id)}
          />
        </div>
      </div>
    </Loading>
  );
};

export default Gallery;
