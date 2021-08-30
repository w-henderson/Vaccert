import React from 'react';
import "../styles/Keygen.scss";

import QRCode from "qrcode.react";

import NhsLogo from '../images/NhsLogo';
import Loading from './Loading';
import FirebaseContext from '../FirebaseContext';
import { push, ref, set } from 'firebase/database';

enum KeygenPhase {
  Ready,
  Loading,
  Result
}

interface Key {
  name: string,
  id: string,
  key: string
}

interface KeygenProps {
  finishCallback: () => void,
}

interface KeygenState {
  name: string,
  bits: string,
  phase: KeygenPhase,
  key?: Key
}

class Keygen extends React.Component<KeygenProps, KeygenState> {
  constructor(props: KeygenProps) {
    super(props);

    this.state = {
      name: "",
      bits: "2048",
      phase: KeygenPhase.Ready
    }

    this.submit = this.submit.bind(this);
  }

  submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.setState({ phase: KeygenPhase.Loading });

    window.setTimeout(() => {
      // Call Rust WASM methods to generate keys
      import("../../keygen/pkg").then(async wasm => {
        let privateKey = wasm.generate_private_key(parseInt(this.state.bits));
        let publicKey = wasm.generate_public_key(privateKey);

        let newRef = push(ref(this.context.database, "keys"));
        set(newRef, {
          key: publicKey.replace(/\n/g, " ").trim(),
          name: this.state.name
        }).then(() => {
          this.setState({
            phase: KeygenPhase.Result,
            key: {
              name: this.state.name,
              id: newRef.key!,
              key: privateKey
            }
          })
        });
      });
    }, 100);

    return false;
  }

  render() {
    return (
      <div className="Dashboard Keygen">
        <div>
          <header>
            <div className="logo">
              <NhsLogo />

              <div className="back">
                <span className="material-icons" onClick={this.props.finishCallback}>arrow_back</span>
              </div>
            </div>

            <div className="text">
              <h1>Certification Key Generation</h1>
              Please fill out the fields below to generate a new Vaccert certification key.
            </div>
          </header>

          {this.state.phase === KeygenPhase.Ready &&
            <div className="content">
              <h1>Key Information</h1>
              <form onSubmit={this.submit}>
                <input
                  placeholder="Name"
                  type="text"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })} />
                <select value={this.state.bits} onChange={e => this.setState({ bits: e.target.value })}>
                  <option value="512">512 bits</option>
                  <option value="1024">1024 bits</option>
                  <option value="2048">2048 bits</option>
                </select>
                <input type="submit" value="Generate" />
              </form>
            </div>
          }

          {this.state.phase === KeygenPhase.Loading &&
            <div className="content">
              <h1>Generating key, please wait...</h1>
              <Loading />
            </div>
          }

          {this.state.phase === KeygenPhase.Result &&
            <div className="content">
              <h1>Key Generated</h1>
              To install this code onto the Vaccert app, tap the NHS logo to enter staff mode, grant camera permission, then scan this code. Once you press "Finish", the code will be permanently deleted and only accessible from the device on which you scanned it.

              <QRCode
                value={JSON.stringify(this.state.key!)}
                renderAs="svg"
                size={bitsToCodeSize(this.state.bits)} />

              <input type="submit" value="Finish" onClick={this.props.finishCallback} />
            </div>
          }
        </div>
      </div>
    );
  }
}

function bitsToCodeSize(bits: string): number {
  switch (bits) {
    case "512": return 250;
    case "1024": return 450;
    case "2048": return 600;
  }
  return 450;
}

Keygen.contextType = FirebaseContext;

export default Keygen;
