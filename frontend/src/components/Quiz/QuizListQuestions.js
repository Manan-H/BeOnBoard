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
                {
                  item.head.questionType === 'text' ?
                  <List bordered="true" size="small" >
                  {
                    item.options.map( option => {
                      return (
                        <List.Item 
                          key={`${item.id}/${option.id}`} 
                          extra={ 
                            item.correctOptions.includes(option.id) ? 
                            <div style={{display:'inline', marginLeft:'8px'}}>
                              <Tag color="green">correct</Tag>
                            </div> : null 
                          } 
                        >                      
                          {option.text}
                        </List.Item>
                      )
                    })
                  }
                </List> :
                <img src={item.photo.img} height='100'></img>
                }
               
              </Panel>)
            })
          }
        </Collapse>
    </div>
  )
}

export default QuizListQuestions;

