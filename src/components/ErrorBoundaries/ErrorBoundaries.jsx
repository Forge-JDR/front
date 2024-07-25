import React from "react";
import ErrorComponent from "./ErrorComponent";

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, errorInfo) {
       console.log(error, errorInfo);
        this.setState({ hasError: true });
    }
  
    render() {
      if (this.state.hasError) {
        return <ErrorComponent />;
      }
      return this.props.children;
    }
  }

export default ErrorBoundary;