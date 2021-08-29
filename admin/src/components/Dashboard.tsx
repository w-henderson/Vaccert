import React from 'react';
import "../styles/Dashboard.scss";

enum AnimationPhase {
  Before,
  During,
  After
}

interface DashboardProps {
  dimensions: { width: number, height: number }
}

interface DashboardState {
  animationPhase: AnimationPhase
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = { animationPhase: AnimationPhase.Before };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ animationPhase: AnimationPhase.During }), 100);
    setTimeout(() => this.setState({ animationPhase: AnimationPhase.After }), 600);
  }

  render() {
    if (this.state.animationPhase === AnimationPhase.Before) {
      return (
        <div className="Dashboard" style={{
          borderRadius: 8,
          width: this.props.dimensions.width,
          height: this.props.dimensions.height
        }}></div>
      );
    } else {
      return (
        <div className="Dashboard main">
          <div style={{ opacity: this.state.animationPhase === AnimationPhase.After ? 1 : 0 }}>
            Content go brr
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
