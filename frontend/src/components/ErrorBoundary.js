import React from "react";
import { Result } from "antd";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="warning"
          title="There are some problems with your operation."
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
