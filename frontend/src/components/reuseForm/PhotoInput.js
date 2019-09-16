import React from 'react';
import { Upload, Button, Icon } from 'antd';
const { REACT_APP_API_ROOT, REACT_APP_VERSION } = process.env;

const PhotoInput = props => {

  const handleImport = inf => {
    const { response, status } = inf.file;
    if(response  && status === "done") {
      props.onProfilePhotoChange(props.name,response)
    }
  }

  const getFileList = defaultValue => ([{
    uid: "-1",
    status: "done",
    url: defaultValue,
    thumbUrl: defaultValue
  }])
  
  const onRemove = () => {
      props.onProfilePhotoChange(props.name,null)
  }
  return (
    <Upload  name = "file"
            accept='image/*'
            multiple={ props.multiple || true}
            withCredentials = {true}
             action = {`${REACT_APP_API_ROOT}/api/${REACT_APP_VERSION}/${props.action}`} 
             onChange = {handleImport}
             listType = "picture"
             onRemove = {onRemove}
             defaultFileList = {props.defaultValue ?
                                 getFileList(props.defaultValue) :
                                 null} >
      <Button disabled = {props.disabled}>
        <Icon type="upload" /> Upload
      </Button>
    </Upload>
  )
}

export default PhotoInput

