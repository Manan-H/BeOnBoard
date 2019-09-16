import React, { useState } from 'react';
import {Form, Input, Select, Icon, notification} from 'antd';
import { doGet } from '../../utils/request';

const { Option } = Select;
const { Item } = Form;

const { REACT_APP_DISABLE_MAIL_VERIFY } = process.env;

const SetEmail = props => {

  const [ validation, setValidation ] = useState({});
  const [ isEmailVerified, setIsEmailVerified ] = useState(false);
  
  const verifyEmail = email => {
    if(!email) return;

    if (REACT_APP_DISABLE_MAIL_VERIFY) {
      setValidation({ validateStatus: 'success', help: 'this email is good to go' });
      return setIsEmailVerified(true);
    }
    
    // request server to check unique email
    setValidation({ validateStatus: 'validating', help: '' });
    doGet(`users/is-email-unique/${email}`)
      .then( ({isUnique, message})=>{
        if (isUnique) {
          setValidation({ validateStatus: 'success', help: 'this email is good to go' });
          return setIsEmailVerified(true);
        }
        setValidation({ validateStatus: 'error', help: 'this email is already registered' });
        return setIsEmailVerified(false);
      })
      .catch(err=>{
        setValidation({ validateStatus: 'error', help: 'network error, could not verify email' });
          notification.error({
              message: 'Oops! Something went wrong!',
              description: err.message,
          });
      })
  }

  props.disableNext(!(props.type && isEmailVerified));
  
  return(
    <div 
      className="SetEmail" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems:'center',
        margin: '30px'
      }}
    >
      <Item label="Google Email" colon={false} {...validation} >
        <Input 
          prefix={<Icon type="google" />}
          type="email" 
          value={props.email || ''}
          onChange={ e => { props.set('email', e.target.value); setValidation({}) } }
          style={{ width: '300px'}}
          onBlur={ () => verifyEmail(props.email) } 
        />
      </Item>
      <Item label="Type" colon={false}>
        <Select value={props.type} onChange={value => props.set('userType',value )} style={{ width: '300px'}}>
          <Option value={2}>User</Option>
          <Option value={1}>Admin</Option>
        </Select>
      </Item>

    </div>
  )
};

export default SetEmail;