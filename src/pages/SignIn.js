import React, { useState } from 'react';
import Logo from '../images/uw_name_logo.jpg';
import { Card, Typography, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => setLoading(true))
      .catch(function (error) {
        setError(true);
        console.log('ERROR: Sign in failed.' + error.code);
      });
  };

  if (loading) {
    return (
      <div
        style={{
          marginLeft: '2em',
          marginTop: '2em',
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          marginTop: -200,
          marginLeft: -350,
        }}
      >
        <Card style={{ width: 700, height: 400 }}>
          <div style={{ marginTop: 50, textAlign: 'center' }}>
            <img src={Logo} alt="Logo" />
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 20 }}>
            <Typography variant="h5">
              Service Learning Volunteering Admin Site
            </Typography>{' '}
          </div>
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: 400,
              marginTop: 10,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              error={error}
              label="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: 400,
              marginTop: 10,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              error={error}
              label="Password"
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Button
              variant="contained"
              style={{ marginTop: 10 }}
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          </div>

          <div style={{ marginTop: 15, textAlign: 'right', marginRight: 20 }}>
            <Typography>
              <i>Please use a pre-authorized email to login</i>
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
