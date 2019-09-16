import React from 'react';
import { Tabs } from 'antd';

import QuizForm from './QuizForm';
import QuizPhotoForm from './QuizPhotoForm';

const { TabPane } = Tabs;

const QuizAdminMenu = props => {
  return (
    <div className='QuizAdminMenu'>
      <Tabs defaultActiveKey='tb1'>
        <TabPane tab='Create a classic quiz' key='tb1'>
          <QuizForm />
        </TabPane>
        <TabPane tab='Create a photo quiz' key='tb2'>
          <QuizPhotoForm />
        </TabPane>
      </Tabs>
    </div>
  )
}


export default QuizAdminMenu;