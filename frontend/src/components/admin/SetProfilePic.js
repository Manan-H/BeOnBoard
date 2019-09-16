import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { Redirect, withRouter } from 'react-router-dom'
import Image from '../Image';
import Upload from '../Upload';
import doUpload from '../../utils/doUpload';



const style = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '500px',
  alignItems: 'center',
  margin: '32px auto'
}

const margin = {
  marginBottom: '16px'
}

const SetProfilePic = props => {

  const [ error, setError] = useState('');
  const [ isLoading, setIsLoading] = useState(false);
  const [ previews, setPreviews ] = useState([]);

  const [success, setSuccess] = useState(false);


  useEffect(()=>{
    error && notification.error({ message: 'Upload error', description: error });
  }, [ error ]);

  function uploadPic() {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', previews[0].data );

    doUpload(`upload/${props.id}`, formData)
      .then( data => {
        notification.success({
          message: 'Uploading finished',
          description: 'Profile picture was uploaded successfully'
        })
        setSuccess(true);
      })
      .catch( err => {
        setError('There was a problem with file transfer. Im sorry');
        notification.error({
          message: 'Oops! Something went wrong!',
          description: err.message,
        });
      })
      .finally( () => setIsLoading(false));
  }

  if (success) {
    return <Redirect to={`team/profile/${props.id}`} />
  }

  return (
   <div className="SetProfilePic" style={style}>  
    {
      previews.length > 0 && <Image src={previews[0].img} style={margin}/>

    }
    <div style={{textAlign: 'center'}}>
      {
         previews.length > 0 && 
          <Button 
            type="primary" 
            onClick={uploadPic}
            loading={isLoading}
            style={margin}
          > Submit Profile Picture </Button>
       }

      <Upload 
          multiple={false}
          isLoading={isLoading}
          style={margin}
          handlePreviews={ previews => setPreviews(previews) }
          accept='image'
      />

    </div>

   </div>
  )
}

export default SetProfilePic;