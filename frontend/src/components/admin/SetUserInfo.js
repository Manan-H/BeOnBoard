import React from 'react';
import { Row, Col, Form, Input, Button, Result } from 'antd';
import { Link } from 'react-router-dom';

import SetExtraInfo from './SetExtraInfo';
const { Item } = Form;

const EMPTY_MESSAGE = 'this field is required';
const REQUIRED_RULES = [{ required:true, message: EMPTY_MESSAGE }];
const NAME_RULES = [
  ...REQUIRED_RULES, 
  { max:20, message: 'entry too long' },
  { min: 2, message: 'entry too short' },
  { pattern: /^[A-Za-z\-]+$/, message: 'unexpected character' }
];
const PHONE_RULES = [
  ...REQUIRED_RULES, 
  { pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, message: 'wrong format' }
];
const EMAIL_RULES = [{ required: true, message:EMPTY_MESSAGE }, { type: 'email', message: 'wrong email' }];


const requiredInfo = [
  { id: 'name', label: 'Name', rules: NAME_RULES },
  { id: 'surname', label: 'Surname', rules: NAME_RULES },
  { id: 'corpEmail', label: 'Corporate Email', rules: EMAIL_RULES },
  { id: 'phoneNumber', label: 'Phone Number', rules: PHONE_RULES },
  { id: 'position', label: 'Position', rules: REQUIRED_RULES  }
];


const handleChange = ( props, changedValue ) => {
  const entry = Object.entries(changedValue)[0];
  const [ key, value ] = entry;
  props.set( key, value );
  props.disableNext(true);
} 


const SetUserInfo = props => {

  props.disableNext(!props.newUserId);
  
  const {
    getFieldDecorator,
    validateFields
  } = props.form;

  const validateAndCreate = () => {
    validateFields( (err, values) => {
      if (err) return;
      props.createUser();
      props.disableNext(false);
    })
  }

  const success = (
    <Result
      title="The user has been created"
      subTitle={
        <p>
          Proceed to next step to upload a profile picture{" "}
          <Link to={`team/profile/${props.newUserId}`} >
            or go straight to their profile page
          </Link>
        </p>

      }
      status="success"
    />
    
  )



  return (
    <div 
      className="SetUserInfo" 
      style={{ 
        marginTop: '30px',
        marginBottom: '30px'
      }}
    >
      {
        props.newUserId ? success : <>
    <Form hideRequiredMark={true} layout='vertical'>
      <Row gutter={56} >        
        <Col 
          xs={{span: 22, offset: 1}}
          sm={{span: 18, offset: 3}}
          md={{span: 14, offset: 5}}
          lg={{span: 9, offset: 2}}

         >
          <h3>Required Info</h3>
          { requiredInfo.map( ({ id, label, rules }) => (
            <Item label={label} colon={false} key={id}>
              {
                getFieldDecorator(id, {
                  initialValue: props[id] || '',
                  rules
                })( <Input /> )
              }          
            </Item>
          )) }  
        </Col>

        <Col 
          xs={{span: 22, offset: 1}}
          sm={{span: 18, offset: 3}}
          md={{span: 14, offset: 5}}
          lg={{span: 9, offset: 2}}
        >
        <h3>Additional Info</h3>
         <SetExtraInfo 
          set={props.set} 
          birthday={props.birthday}
          hobbies={props.hobbies} 
          professionalSkills={props.professionalSkills}
          social={props.social}
          experience={props.experience}
          shortInfo={props.shortInfo}
         />
        
        </Col>

      </Row>

    </Form>
    <div style={{textAlign:'center'}}>
      <Button 
        type="primary" 
        onClick={ validateAndCreate } 
        icon={ props.createUserInProcess ? 'loading' : ''}
        disabled={ props.createUserInProcess }
      > 
        {props.createUserInProcess ? '' : 'Save'} 
      </Button>
      </div>
        </>
      }
   
   
    </div>
  )
};

export default Form.create({ name: 'user-info', onValuesChange: handleChange })(SetUserInfo);