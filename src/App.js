import React, { Component } from 'react';
import firebase from 'firebase';
import config from './config';
import Admin from './pages/Admin';
import SignIn from './pages/SignIn';

class App extends Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    this.state = {
      data: undefined,
      email: '',
      isSignedIn: false,
    };
    firebase
      .database()
      .ref()
      .once('value')
      .then((value) => {
        this.state.data = value.toJSON();
      });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (
          user.email === 'slweb@uw.edu' ||
          user.email === 'slwebuw@gmail.com'
        ) {
          this.setState({ isSignedIn: true, email: user.email });
        } else {
          alert(
            user.email +
              'is an unauthorized email. Please log in with an authorized email.'
          );
        }
      }
    });
  }

  signIn = () => {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      // Target specific email with login hint.
      login_hint: 'netid@uw.edu',
    });
    firebase
      .auth()
      .signInWithPopup(provider)
      .catch(function (error) {
        console.log('ERROR: Sign in failed.' + error.code);
      });
  };

  render() {
    return this.state.isSignedIn ? (
      <Admin data={this.state.data} email={this.state.email} />
    ) : (
      <SignIn signIn={this.signIn} />
    );
  }
}

export default App;
