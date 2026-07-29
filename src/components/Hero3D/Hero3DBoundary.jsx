import React from "react";
import ProfComponent from "../Banner/ProfComponent";

class Hero3DBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("3D hero failed, falling back to static hero:", error);
  }

  render() {
    if (this.state.failed) return <ProfComponent />;
    return this.props.children;
  }
}

export default Hero3DBoundary;
