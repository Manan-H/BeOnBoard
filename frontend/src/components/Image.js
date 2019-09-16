import React, { useState } from 'react';
import { Spin, Icon } from 'antd';

const Image = props => {

  const [ didImageLoad, setDidImageLoad ] = useState(false);
  const [ didImageFail, setDidImageFail ] = useState(false);

  const imageRef = React.createRef();
  const image = imageRef.current || {};

  const hidden = { display: 'none' };
  const divStyle = { 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    width: props.width || image.naturalWidth || '100%', 
    height: props.height || image.naturalHeight || '100px'
  }

  const loadingIcon = <Icon type="loading" style={{ fontSize: 72 }} />
  const errorIcon = <Icon type="meh" style={{ fontSize: 72 }} />

  if (!props.src) return null;

  return (
    <>
      <img 
        src={ props.src } 
        height={ props.height || image.naturalHeight }
        width={ props.width || image.naturalWidth }
        onLoad={ ()=>setDidImageLoad(true) }
        onError={ ()=>setDidImageFail(true) }
        style={ didImageLoad ? {} : hidden }
        alt={ props.alt || '' }
        ref={ imageRef }
        { ...props }
      />
      <div
        style={ Object.assign(divStyle, didImageLoad && hidden ) } 
      >
        <Spin 
          indicator={ didImageFail ? errorIcon : loadingIcon } 
        />
      </div>
    </>
  )
}

export default Image;