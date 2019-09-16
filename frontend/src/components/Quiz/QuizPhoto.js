import React, { useState, useEffect } from "react";
import { Slider } from "antd";

const marginLarge = {
  marginBottom: 32
};

const QuizPhoto = props => {
  // props.photo = { img: PHOTO_URL_HERE }
  // props.handleAnswerCoords = ( answerCoords ) => YOUR_FUNCTION(answerCoords)
  // answerCoords will look like this { x: ... , y: ... }
  // props.targetStyle = { borderColor: 'green' }, etc, but dont set top, left, position!

  const { photo } = props;

  const [targetSize, setTargetSize] = useState(0.1); // % relative to image width

  const [targetPosition, setTargetPosition] = useState({}); // % relative to image top left corner

  const [answerCoords, setAnswerCoords] = useState({});

  const [photoWidth, setPhotoWidth] = useState(0);

  const imageRef = React.createRef();

  useEffect(() => {
    updatePhotoWidth();
    window.addEventListener("resize", updatePhotoWidth);
    return () => window.removeEventListener("resize", updatePhotoWidth);
  }, [imageRef]);

  const updatePhotoWidth = () => {
    if (!imageRef.current) return;
    setPhotoWidth(imageRef.current.scrollWidth);
  };

  useEffect(() => {
    if (!props.handleTargetChange) return;

    props.handleTargetChange(getCorrectRange());
  }, [targetPosition, targetSize]);

  useEffect(() => {
    if (!props.handlePhotoChange) return;

    props.handlePhotoChange(photo);
  }, [photo]);

  useEffect(() => {
    if (!props.handleAnswerCoords) return;

    props.handleAnswerCoords(answerCoords);
  }, [answerCoords]);

  useEffect(() => {
    if (!props.handleTargetSize) return;

    props.handleTargetSize(targetSize);
  }, [targetSize]);

  useEffect(() => {
    const initialCoords = { x: 0, y: 0 };
    if (!props.getClientSetCoords) {
      setTarget(initialCoords);
      return;
    }
    return setTarget(props.getClientSetCoords() || initialCoords);
  }, []);

  useEffect(()=>{
    if(!props.targetPosition) return;
    setTargetPosition(props.targetPosition || { x:0, y:0 });
  }, [props.photo])

  useEffect(()=>{
    if(!props.targetSize) return;
    setTargetSize(props.targetSize || 0.1);
  }, [props.photo])

  const getClickCoords = e => {
    const left = e.currentTarget.getBoundingClientRect().left;
    const top = e.currentTarget.getBoundingClientRect().top;
    const width = e.currentTarget.scrollWidth;
    const height = e.currentTarget.scrollHeight;
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    setAnswerCoords({ x: mouseX / width, y: mouseY / height })
    return { x: mouseX / width, y: mouseY / height };
  };

  const setTarget = clickCoords => {

    const isOverflowLeft = clickCoords.x - targetSize / 2 < 0;
    const isOverflowTop = clickCoords.y - targetSize / 2 < 0;
    const isOverflowRight = clickCoords.x + targetSize / 2 > 1;
    const isOverflowBottom = clickCoords.y + targetSize / 2 > 1;
    const targetX = isOverflowLeft
      ? 0
      : isOverflowRight
      ? 1 - targetSize
      : clickCoords.x - targetSize / 2;
    const targetY = isOverflowTop
      ? 0
      : isOverflowBottom
      ? 1 - targetSize
      : clickCoords.y - targetSize / 2;

    setTargetPosition({ x: targetX, y: targetY });
  };

  const getCorrectRange = () => {
    return {
      x: {
        start: targetPosition.x,
        end: targetPosition.x + targetSize
      },
      y: {
        start: targetPosition.y,
        end: targetPosition.y + targetSize
      }
    };
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    visibility: photo.img ? "visible" : "hidden"
  };

  const targetStyle = {
    position: "absolute",
    border: "3px solid blue",
    top: `${targetPosition.y * 100}%`,
    left: `${targetPosition.x * 100}%`,
    width: `${targetSize * photoWidth}px`,
    height: `${targetSize * photoWidth}px`,
    ...(props.targetStyle || {})
  };

  return (
    <div className="QuizPhoto">
      {photo.img && <h3> Set correct area </h3>}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: "600px"
        }}
        onClick={e => setTarget(getClickCoords(e))}
      >
        <img style={imageStyle} src={photo.img} ref={imageRef} />
        {photo.img && <div style={targetStyle}></div>}
      </div>
      {!photo.img || props.handleAnswerCoords ? null : (
        <div>
          <p>Set target size</p>
          <Slider
            style={{ marginLeft: "20px", maxWidth: "600px" }}
            value={targetSize}
            onChange={value => setTargetSize(value)}
            min={0.1}
            max={0.4}
            step={0.1}
            marks={{
              0.1: "Small",
              0.2: "Normal",
              0.3: "Large",
              0.4: "Huge"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuizPhoto;
