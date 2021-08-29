import React from 'react';
import '../styles/SignIn.scss';

import NhsLogo from '../images/NhsLogo';
import Loading from "./Loading";

interface SignInState {
  email: string,
  password: string,
  rememberMe: boolean,
  loading: boolean
}

class SignIn extends React.Component<{}, SignInState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: false,
      loading: false
    };

    this.submit = this.submit.bind(this);
  }

  submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.setState({ loading: true });
    return false;
  }

  render() {
    if (!this.state.loading) {
      return (
        <div className="SignIn">
          <div className="logo">
            <NhsLogo />
          </div>

          <div className="form">
            <form onSubmit={this.submit}>
              <input
                type="email"
                placeholder="Email address"
                name="email"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })} />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })} />

              <div>
                <div onClick={e => this.setState({ rememberMe: !this.state.rememberMe })}>
                  <input
                    type="checkbox"
                    checked={this.state.rememberMe}
                    readOnly={true} />
                  <span>Remember Me</span>
                </div>
                <div>
                  <input type="submit" value="Sign In" />
                </div>
              </div>

            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="SignIn">
          <div className="logo">
            <NhsLogo />
          </div>

          <div className="form" style={{ paddingTop: 64, paddingBottom: 64 }}>
            <Loading />
          </div>
        </div>
      )
    }
  }
}

export default SignIn;
