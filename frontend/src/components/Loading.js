import React from 'react';
import { Spin } from 'antd';

const loadingContainerStyle = { 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', 
  width: '100%', 
  height: '200px' 
}

const Loading = props => {
  if (props.isLoading) {
    return <div style={ loadingContainerStyle } > <Spin size='large' /> </div>
  }
  return props.children;
}
  
export default Loading;
