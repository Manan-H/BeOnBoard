import React, { useState } from 'react';
import { Steps, Button, Icon, notification } from 'antd';
import { socket } from '../../utils/socketHelper/socketIO';
import { NEW_USER } from "../../utils/socketHelper/events";

import { doPost } from '../../utils/request';
import { usersBaseUrl } from '../../utils/apiEndpoints/usersEndpoints';

import SetEmail from './SetEmail'; 
import SetUserInfo from './SetUserInfo'; 
import SetProfilePic from './SetProfilePic'; 

const { Step } = Steps;

const AddUser = props => {

  const [ currentStep, setCurrentStep ] = useState(0);
  const [ userInfo, setUserInfo ] = useState({});
  const [ newUserId, setNewUserId ] = useState('');
  const [ isNextDisabled, setIsNextDisabled ] = useState(true);
  const [ createUserInProcess, setCreateUserInProcess ] = useState(false);


  const createUser = () => {
    setCreateUserInProcess(true);
    doPost(usersBaseUrl, userInfo)
    .then(newUser => {
        setNewUserId(newUser._id);
        socket.emit(NEW_USER, newUser);
        notification.open({
          message: 'New user has been created successfully!',
          description: '',
          icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
        });
    })
    .catch(err => {
        notification.error({
            message: 'Oops! Something went wrong!',
            description: err.message,
        });
    })
    .finally(()=>setCreateUserInProcess(false));
    
  }


  return(
    <div className="AddUser">
      <Steps current={currentStep}>
        <Step title="Add Google Email" />
        <Step title="Provide User Info"/>
        <Step title="Upload a Profile Picture"/>
      </Steps>

      { currentStep === 0 && 
        <SetEmail 
          email={userInfo.email} 
          type={userInfo.userType} 
          set={ (key, value) => setUserInfo({ ...userInfo, [key]: value })}
          disableNext={ bool => setIsNextDisabled(bool) } 
        />
      }

      { currentStep === 1 && 
        <SetUserInfo 
          name={userInfo.name} 
          surname={userInfo.surname} 
          corpEmail={userInfo.corpEmail} 
          phoneNumber={userInfo.phoneNumber} 

          position={userInfo.position} 
          education={userInfo.education} 
          birthday={userInfo.birthday}
          
          hobbies={userInfo.hobbies || []}
          skills={userInfo.skills || []}
          professionalSkills={userInfo.professionalSkills || []}
          social={userInfo.social || []}

          experience={userInfo.experience}
          shortInfo={userInfo.shortInfo}

          newUserId={newUserId}
          createUserInProcess={createUserInProcess}

          set={ (key, value) => setUserInfo({ ...userInfo, [key]: value })}
          disableNext={ bool => setIsNextDisabled(bool) } 

          createUser={ createUser }
          newUserId={ newUserId }
        />
      }

      { currentStep === 2 && 
        <SetProfilePic 
          name={userInfo.name} 
          surname={userInfo.surname} 
          id={ newUserId }
          
          set={ (key, value) => setUserInfo({ ...userInfo, [key]: value })}
          disableNext={ bool => setIsNextDisabled(bool) } 
        />
      }

      <div className="controls" style={{ display: 'flex', justifyContent: 'space-around' , margin: '30px'}}>
        { currentStep > 0 && !newUserId && 
          <Button 
            icon="left"
            onClick={ () => setCurrentStep( currentStep - 1 ) }
          >Go Back</Button>
        }
        { currentStep < 2 && 
          <Button 
            onClick={ () => setCurrentStep( currentStep + 1 ) }
            disabled={ isNextDisabled }
            style={{ cursor: isNextDisabled ? 'default' : 'pointer' }}
          >Next Step<Icon type="right" /></Button>
        }

      </div>

    </div>
  )
};

export default AddUser;