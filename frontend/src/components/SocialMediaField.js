import React, { useState, useEffect } from 'react';
import { Avatar, Switch, notification, Button, Input, Icon } from 'antd';
import verifyUrl from '../utils/verifyUrl';

const medias = [
  { name: 'facebook', color: '#3b5998' },
  { name: 'twitter', color: '#38A1F3' },
  { name: 'github', color: '#7dbbe6' },
  { name: 'instagram', color: '#231F20' },
  { name: 'slack', color: '#3F0F3F' },
  { name: 'codepen', color: '#3F0F3F' },
  { name: 'linkedin', color: '#007bb6' }
];

const avatarStyle = {
  cursor: 'pointer',
  margin: '10px'
};

const deleteStyle = {
  position: 'absolute',
  top: '7%',
  right: '7%'
}

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap'
};

const margin = {
  marginBottom: '16px'
}


const SocialMediaField = props => {
  // you can pass style and handleChange function as props

  const [ social, setSocial ] = useState(props.defaultSocial || []);
  const [ input, setInput ] = useState('');
  const [ isDeleteModeOn, setIsDeleteModeOn] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect( () => {
    if (props.handleChange) {
      props.handleChange(social);
    }
  }, [social])

  const handleSubmit = url => {
    if(!url) return;

    if (!url.substring(0,8).match(/https?:\/\//)) {
      url = 'https://' + url;
    }

    if (social.find( link => link.url === url)) {
      notification.error({
        message: 'This link has already been added to the list'
      });
      return;
    }

    //check url validity from server
    setIsLoading(true);
    verifyUrl(url)
      .then( res => {
        if (!res.ok) {
          notification.warning({
            message: 'Verification failed',
            description: `${url} is unaccessible`
          });
          return;
        }

        const media = medias.find( item => url.includes(item.name)) || {};

        setSocial([ ...social, {
          media: media.name || 'default',
          url,
          color: media.color || '#1890ff'
        }]);
    
        setInput('')
      })      
      .catch( err => {
        notification.warning({
          message: 'Verification failed',
          description: `Couldn't connect to server`
        });
      })
      .finally(()=>setIsLoading(false));  

  }

  const removeFromList = removedUrl => {
    setSocial(social.filter( ({url}) => url !== removedUrl ));
    if(social.length === 0) {
      setIsDeleteModeOn(false);
    }
  }
  

  return (
    <div style={ props.style || {}}>
      <Input.Search 
        value={input} 
        onChange={e=> { setInput(e.target.value.trim()); setIsDeleteModeOn(false) }}
        onSearch={()=> handleSubmit(input) } 
        onPressEnter = {e => { e.preventDefault(); handleSubmit(input) }}
        placeholder="link to your profile"
        style={margin}
        enterButton={ <Button type="primary" loading={isLoading}>Add</Button> } 
      />  

      { social.length > 0 &&
      <div>
        <div>
          <span>Delete mode: </span>
          <Switch 
            onClick={ bool => setIsDeleteModeOn(bool) }
            checked={ isDeleteModeOn }
            size='small'
          />
        </div>
        <div style={containerStyle}>
          {
            social.map( ({media, url, color}, i) => <div key={`media${i}`}style={{ position: 'relative' }}>
              <Avatar 
                size='large'
                shape='square'
                icon={media === 'default' ? 'message' : media } 
                style={{ ...avatarStyle, backgroundColor: color }}
                onClick={()=>{
                  isDeleteModeOn ? 
                    removeFromList(url) :
                    window.open(url, '_blank')
                }}
              />
              {
                isDeleteModeOn && 
                  <Icon 
                    style={deleteStyle} 
                    type="close-circle" 
                    fill="red" 
                    theme="filled"
                  />
              }
        
            </div>)
          }
        </div>
      </div>
      }


    </div>
  )
}

export default SocialMediaField;