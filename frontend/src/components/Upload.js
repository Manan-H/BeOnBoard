import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import uuidv4 from 'uuid/v4';


const Upload = props => {

  const [ uploadedFiles, setUploadedFiles ] = useState({}); 
  const [ formData, setFormData ] = useState(null);
  const [ previews, setPreviews ] = useState([]);
  const [ error, setError ] = useState('');

  useEffect(()=>{
    error && notification.error({ message: 'Upload error', description:error });
  }, [ error ]);

  useEffect(()=>{
    if (!props.handleFormData) return;
    if (Object.keys(uploadedFiles).length === 0) return;

    const newFormData = new FormData();
    Object.values(uploadedFiles).forEach( ({id, data}) => newFormData.append( id, data ));
    setFormData(newFormData);

  }, [ uploadedFiles ])

  useEffect(()=>{
    if (!props.handlePreviews) return;
    if (Object.keys(uploadedFiles).length <= previews.length) return;
    
    const file = Object.values(uploadedFiles)[previews.length];

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews([ ...previews, { 
        img: reader.result, 
        id: file.id, 
        data: file.data,
        delete: ()=>deleteFile(file.id) 
      } ]);
    }  
    reader.readAsDataURL(file.data);

  }, [ uploadedFiles, previews ]);

  useEffect(()=>{
    if (!props.handlePreviews ) return;
    props.handlePreviews(previews);
  }, [ previews ]);

  useEffect(()=>{
    if (!props.handleFormData) return;
    props.handleFormData(formData);
  }, [ formData ]);

  useEffect(()=>{
    if (!props.handleUploadedFiles) return;
    props.handleUploadedFiles(uploadedFiles);
  }, [ uploadedFiles ]);

  const input = React.createRef();

  const handleFiles = () => {

    const files = input.current.files;
    if (files.length === 0) return;

    if (props.fileLimit && files.length > props.fileLimit) {
      setError('Maximum number of files to upload: ' + props.fileLimit);
      return;
    }

    const validFiles = Object.values(files).filter( file => {
      const types = [].concat(props.accept || []);

      if (types.length === 0) return true;

      if (!types.includes(file.type.split('/')[0])) {
        setError(`Wrong type: ${file.name}`);
        return false;
      }
      
      return true;
    });

    const normalizedFiles = validFiles.reduce( (normalized, file) => {
      const id = uuidv4();
      if (normalized[id]) return normalized;
      normalized[id] = { id, data: file };
      return normalized;
    }, {});

    setPreviews([]);
    
    if (props.multiple) {
      setUploadedFiles({ ...uploadedFiles, ...normalizedFiles });
    } else {
      setUploadedFiles({ ...normalizedFiles });
    }
    input.current.value = '';
  }

  const deleteFile = id => {
    const modifiedFiles = { ...uploadedFiles };
    delete modifiedFiles[id];

    setPreviews([]);
    setUploadedFiles(modifiedFiles); 
  }

  const clearAll = () => setUploadedFiles({});

  return (
    <div className="Upload" style={props.style}>
      <Button 
        onClick={()=> input.current.click()}
        disabled={props.isLoading === true ? true : false} 
        loading={props.isLoading === true ? true : false} 
        { ...(props.buttonProps || {})}
      >
        { props.multiple && Object.keys(uploadedFiles).length>0 ? 'Choose More Files' : 'Choose File' }
        { props.fileLimit && ` (maximum ${props.fileLimit})` } 
      </Button>
      <input 
        type="file" 
        ref={input}
        style={{display: 'none'}}
        onInput={handleFiles}
        multiple={ props.multiple === undefined ? false : props.multiple }
      />
    </div>

    
  )
}

export default Upload;