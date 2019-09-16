import React from 'react';
import { Collapse, Icon, List, Tag } from 'antd';

const { Panel } = Collapse;

const clickableIcon = {
  display:'inline',
  padding: '6px 12px'
}

const QuizListQuestions = props => {

  const {
    list,
    selectQuestionId,
    selectedQuestionId,
    confirmRemove
  } = props;

  return (
    <div className="QuizListQuestions">
      <p>List of questions</p> 
        <Collapse >
          {
            Object.values(list).map( (item, i) => {
              return (
              <Panel 
                key={item.id} 
                header={item.head.title || `Question ${i+1}` }
                extra={<>
                  <div 
                    style={clickableIcon} 
                    onClick={e=>{ e.stopPropagation(); selectQuestionId(item.id) }}
                  >
                    <Icon 
                      type="edit" 
                      style={{ color: selectedQuestionId === item.id ? '#1890ff' : 'inherit' }}
                    />
                  </div>
                  <div style={clickableIcon} onClick={e=>{ e.stopPropagation(); confirmRemove(item.id) }}>
                    <Icon 
                      type="delete" 
                      style={{ color: 'red' }}
                    />
                  </div>                
                  
                </>}
              >
                <p>{item.head.content}</p>
                <img src={item.photo.img} height={100}/>
              </Panel>)
            })
          }
        </Collapse>
    </div>
  )
}

export default QuizListQuestions;

