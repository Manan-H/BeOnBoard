import React from 'react';
import { DatePicker, Form, Input, InputNumber } from 'antd';
import moment from 'moment';
import EditableTagGroup from '../reuseForm/EditableTagGroup';
import SocialMediaField from '../SocialMediaField';

const {  Item } = Form

const SetExtraInfo = props => {
  return (
    <div>
      <Item label="Date of Birth" colon={false}>
        <DatePicker
          format={["DD-MM-YYYY", "DD-MM-YY", "DD/MM/YYYY", "DD/MM/YY"]}
          
          value={props.birthday ? moment(props.birthday) : null} 
          onChange={date=>{
              date = date ? date.utc(true) : null;              
              props.set('birthday',date )}
            } />
      </Item>
      <Item label="Hobbies & Interests" colon={false}>
        <EditableTagGroup
          tags={props.hobbies}
          tagName='hobbie'
          onChangeTag={props.set}
          name="hobbies"
        /> 
      </Item>
      <Item label="Professional Skills" colon={false}>
        <EditableTagGroup
          tags={props.professionalSkills}
          tagName='skill'
          onChangeTag={props.set}
          name="professionalSkills"
        /> 
      </Item>
      <Item label="Social Media" colon={false}>
        <SocialMediaField 
          handleChange={ social => props.set('social', social) }
        />
      </Item>
      <Item label="Years of Experience" colon={false}>
        <InputNumber value={props.experience} min = {0} onChange={n=> props.set('experience',n)} />
      </Item>
      <Item label="Fun Facts" colon={false}>
        <Input.TextArea 
          value={props.shortInfo} 
          autosize={{minRows:2}}
          style={{ resize: 'none' }}
          onChange={e=> props.set('shortInfo',e.target.value)} />
      </Item>
    </div>
  )
}

export default SetExtraInfo;