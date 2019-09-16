import React, { useEffect } from "react";
import { Form, Input, Button, DatePicker, InputNumber, Row, Col } from 'antd';
import EditableTagGroup from "./EditableTagGroup";
import PhotoInput from "./PhotoInput"
import SocialMediaField from "../SocialMediaField";
import moment from 'moment';

const { TextArea } = Input;

const ReuseForm = props => {
    const { onChange, onChangeSocial, onChangeDate,  fields, onSubmit, onCancel, userInfo, userInfoFormErrors, isDisabled, onChangeTag, onProfilePhotoChange } = props;

    const requiredColumn = [];
    const additionalColumn = []

    fields.forEach(({name,placeHolder,isRequired,type, tagName}) => {
      const isError = userInfoFormErrors[name];

      let item;

      switch(type) {
        case "EditableTagGroup": 
          item = <EditableTagGroup tagName = {tagName} name = {name} tags={userInfo[name]} onChangeTag = {onChangeTag} />
          break;
        case "Date":
          const defaultValue = userInfo[name] ? userInfo[name] : null;
          item = <DatePicker  name = {name} 
                              onChange = {date => {
                                date = date ? date.utc(true) : null
                                onChangeDate(name, date)
                              }}
                              defaultValue= {defaultValue ? moment(defaultValue) : null} 
                              format={["DD-MM-YYYY", "DD-MM-YY", "DD/MM/YYYY", "DD/MM/YY"]} />
          break;
        case "Photo": 
          item = <PhotoInput  onProfilePhotoChange = {(name, response) => onProfilePhotoChange(name,response ? response.url : null)}
                              name = {name}
                              action='upload'
                              placeholder = {placeHolder}
                              defaultValue = {userInfo[name]}
                              disabled = {userInfo[name] ? true : false}
                                />
          break;
        case "social":
          item = <SocialMediaField  defaultSocial = {userInfo[name]}
                                    style={{width:"100%"}} 
                                    handleChange = {socs=>{onChangeSocial(name,socs)}} />
          break;
        case "textarea":
          item = <TextArea  type = {type}
                            name = {name}
                            autosize={{minRows:2}}
                            style={{ resize: 'none' }}
                            placeholder = {placeHolder}
                            defaultValue = {userInfo[name]} />
          break;
        case "smallNumber":
          item = <InputNumber name = {name}
                              min={0}
                              placeholder = {placeHolder}
                              defaultValue = {userInfo[name]}
                              onChange = {value => onChange(name,value)} />
          break;
        case "phoneNumber":
            item = <Input name = {name}
                          onChange ={ e=> {
                            e.stopPropagation();
                            onChange(name,e.target.value, "phoneNumber")
                          }}
                          placeholder = {placeHolder}
                          defaultValue = {userInfo[name]} />
            break;
        case "name":
            item = <Input name = {name}
                          onChange ={ e=> {
                            e.stopPropagation();
                            onChange(name,e.target.value, "name")
                          }}
                          placeholder = {placeHolder}
                          defaultValue = {userInfo[name]} />
          break;
        default: 

          item = <Input type = {type}
                        name = {name}
                        placeholder = {placeHolder}
                        defaultValue = {userInfo[name]} />
      }

      const formItem = (
        <Form.Item  validateStatus = { isError && isRequired ? "error" : ""}
                    help = { isError && isRequired ? userInfoFormErrors[name] : ""}
                    key = {name}
                    label = {placeHolder}
                    required = { isRequired }
        > 
          {
            item
          }
          
        </Form.Item>
      )
      if(isRequired) {
        requiredColumn.push(formItem)
      } else {
        additionalColumn.push(formItem)
      }
    });
    
    
    return (
      <Form onChange = {e=>onChange(e.target.name,e.target.value,e.target.type)} onSubmit={onSubmit}>
        <Row>
          <h3></h3>
          <Col  xs={{span: 22, offset: 1}}
                sm={{span: 18, offset: 3}}
                md={{span: 14, offset: 5}}
                lg={{span: 9, offset: 2}}>
            <h3>Required Info</h3>
            {requiredColumn}
          </Col>
          <Col  xs={{span: 22, offset: 1}}
                sm={{span: 18, offset: 3}}
                md={{span: 14, offset: 5}}
                lg={{span: 9, offset: 2}}>
            <h3>Additional Info</h3>
            {additionalColumn}
          </Col>
        </Row>
        <Row type="flex" justify="center">
          {onCancel ? 
            <Button type="default" style={{marginRight: "8px"}} onClick = {onCancel}>
                Cancel
            </Button>
           : null}
          <Button className = "submitButton" type="primary" htmlType="submit" disabled={isDisabled}>
                      Submit
          </Button>
        </Row>
      </Form>
    )


}

export default ReuseForm;