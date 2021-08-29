import React from 'react';
import '../styles/SignIn.scss';

import { browserLocalPersistence, browserSessionPersistence, setPersistence, signInWithEmailAndPassword, User, UserCredential } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import FirebaseContext from '../FirebaseContext';

import NhsLogo from '../images/NhsLogo';
import Loading from "./Loading";

interface SignInProps {
  successCallback: (user: User) => void
}

interface SignInState {
  email: string,
  password: string,
  rememberMe: boolean,
  loading: boolean,
  error: string | null
}

class SignIn extends React.Component<SignInProps, SignInState> {
  constructor(props: SignInProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: false,
      loading: false,
      error: null
    };

    this.submit = this.submit.bind(this);
  }

  async submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.setState({ loading: true });

    if (this.state.rememberMe) await setPersistence(this.context.auth, browserLocalPersistence);
    else await setPersistence(this.context.auth, browserSessionPersistence);

    await signInWithEmailAndPassword(this.context.auth, this.state.email, this.state.password)
      .then((user: UserCredential) => {
        let adminRef = ref(this.context.database, "admin");
        get(adminRef)
          .then(snapshot => {
            if (snapshot.exists()) {
              if (snapshot.val() === user.user.uid) {
                this.props.successCallback(user.user);
              } else {
                this.setState({ error: "You are not authorised to access the admin dashboard", password: "", loading: false });
              }
            } else {
              this.setState({ error: "Cannot find admin user ID in the database, please check your database structure", loading: false });
            }
          })
          .catch(() => {
            this.setState({ error: "Cannot find admin user ID in the database, please check your database structure", loading: false });
          })
      })
      .catch(() => {
        this.setState({ error: "Invalid email or password, please try again", password: "", loading: false });
      });

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
                onChange={e => this.setState({ email: e.target.value, error: null })} />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value, error: null })} />

              {this.state.error !== null &&
                <span>{this.state.error}</span>
              }

              <div>
                <div onClick={_ => this.setState({ rememberMe: !this.state.rememberMe, error: null })}>
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

SignIn.contextType = FirebaseContext;

export default SignIn;
