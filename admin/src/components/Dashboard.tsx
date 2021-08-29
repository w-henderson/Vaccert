import React from 'react';
import "../styles/Dashboard.scss";

import NhsLogo from '../images/NhsLogo';

import { DatabaseReference, onValue, ref } from 'firebase/database';
import FirebaseContext from '../FirebaseContext';

enum AnimationPhase {
  Before,
  During,
  After
}

interface DashboardProps {
  dimensions: { width: number, height: number }
}

interface DashboardState {
  animationPhase: AnimationPhase,
  keys: Key[],
  keyPopup?: Key
}

interface Key {
  key: string,
  name: string,
  id: string
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {
  keysRef: DatabaseReference;

  constructor(props: DashboardProps, context: typeof FirebaseContext) {
    super(props, context);
    this.state = { animationPhase: AnimationPhase.Before, keys: [] };
    this.keysRef = ref(this.context.database, "keys");
  }

  componentDidMount() {
    setTimeout(() => this.setState({ animationPhase: AnimationPhase.During }), 100);
    setTimeout(() => this.setState({ animationPhase: AnimationPhase.After }), 600);

    onValue(this.keysRef, snapshot => {
      let keys: Key[] = [];
      snapshot.forEach(child => {
        keys.push({
          key: child.val().key,
          name: child.val().name,
          id: child.key!
        });
      });
      this.setState({ keys });
    });
  }

  showKeyPopup(key: Key) {
    this.setState({ keyPopup: key });
  }

  render() {
    if (this.state.animationPhase === AnimationPhase.Before) {
      return (
        <div className="Dashboard" style={{
          borderRadius: 8,
          width: this.props.dimensions.width,
          height: this.props.dimensions.height,
          overflow: "hidden"
        }}></div>
      );
    } else {
      return (
        <div className="Dashboard main">
          <div style={{
            opacity: this.state.animationPhase === AnimationPhase.After ? 1 : 0,
            overflow: this.state.animationPhase === AnimationPhase.After ? "auto" : "hidden"
          }}>
            <header>
              <div>
                <NhsLogo />
              </div>

              <div>
                <h1>Vaccert Admin Console</h1>
                Welcome to the Vaccert admin console, where you can manage and generate certification keys.
              </div>
            </header>

            <div className="content">
              <h1>Certification Keys ({this.state.keys.length})</h1>
              <span>
                Certification keys are used by members of staff to cryptographically sign Vaccerts, proving their legitimacy. If you remove a key from this list, any Vaccert which was previously signed by it will become permanently invalidated. When you generate a key, a staff QR code will appear which contains the private key, and this is the only time the private key will be shown.
              </span>

              <div className="keys">
                {this.state.keys.map(key =>
                  <div key={key.id} className="key">
                    <div>
                      <span>{key.name}</span>
                      <span>{key.id}</span>
                    </div>
                    <div>
                      <span onClick={() => this.showKeyPopup(key)}>View</span>
                      <span onClick={() => { }}>Remove</span>
                    </div>
                  </div>
                )}

                <div className="key add">
                  Generate another key
                </div>
              </div>
            </div>

            <div
              className={this.state.keyPopup !== undefined ? "popup" : "popup hidden"}>
              <div>
                <h1>{this.state.keyPopup?.name}</h1>
                <span>{this.state.keyPopup?.id}</span>
                <span
                  className="material-icons close"
                  onClick={() => this.setState({ keyPopup: undefined })}>
                  close
                </span>

                <textarea
                  value={formatKey(this.state.keyPopup?.key) || ""}
                  rows={formatKey(this.state.keyPopup?.key)?.split("\n").length || 0}
                  contentEditable={false} />
              </div>
            </div>
          </div>
        </div >
      );
    }
  }
}

function formatKey(key: string | undefined): string | undefined {
  if (key === undefined) return undefined;

  let spaced = key.split(" ");
  let firstLine = spaced.slice(0, 3).join(" ");
  let keyContent = spaced.slice(3, -3).join("\n");
  let lastLine = spaced.slice(-3).join(" ");

  return firstLine + "\n" + keyContent + "\n" + lastLine;
}

Dashboard.contextType = FirebaseContext;

export default Dashboard;
