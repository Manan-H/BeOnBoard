import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Tag, Input, Tooltip, Icon } from "antd";

class EditableTagGroup extends React.Component {
  state = {
    // tags: ["Unremovable", "Tag 2", "Tag 3"],
    inputVisible: false,
    inputValue: ""
  };

  handleClose = removedTag => {
    const tags = this.props.tags.filter(tag => tag !== removedTag);
    this.props.onChangeTag(this.props.name, tags);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    let { value } = e.target;
    if(value.length > 25) {
      value = value.slice(0,25)
    }
    this.setState({ inputValue: value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.props;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    this.props.onChangeTag(this.props.name, tags)

    this.setState({
      inputVisible: false,
      inputValue: ""
    });
  };

  saveInputRef = input => (this.input = input);

  render() {
    const { inputVisible, inputValue } = this.state;
    const { tags } = this.props;
    return (
      <div>
        {tags ? tags.map((tag, index) => {
          const isLongTag = tag.length > 12;
          const tagElem = (
            <Tag
              key={tag}
              closable={true}
              onClose={() => this.handleClose(tag)}
            >
              {isLongTag ? `${tag.slice(0, 12)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        }) : []}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: "#fff", borderStyle: "dashed" }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup;