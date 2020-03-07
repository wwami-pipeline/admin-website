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
      isSignedIn: false
    };
    firebase
      .database()
      .ref()
      .once('value')
      .then(value => {
        this.state.data = value.toJSON();
      });
  }

  signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        if (res.user.email !== 'slweb@uw.edu') {
          alert('Error: Unauthorized Email.');
        } else {
          this.setState({ isSignedIn: true });
        }
      })
      .catch(function(error) {
        console.log('ERROR: Sign in failed.' + error.code);
      });
  };

  render() {
    return this.state.isSignedIn ? (
      <Admin data={this.state.data} />
    ) : (
      <SignIn signIn={this.signIn} />
    );
  }
}

export default App;
