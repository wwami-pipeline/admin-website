import React from 'react';
import Logo from '../images/uw_name_logo.jpg';
import { Card, Typography, Button } from '@material-ui/core';

const SignIn = props => (
  <div>
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginTop: -175,
        marginLeft: -350
      }}
    >
      <Card style={{ width: 700, height: 350 }}>
        <div style={{ marginTop: 50, textAlign: 'center' }}>
          <img src={Logo} alt="Logo" />
        </div>
        <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 20 }}>
          <Typography variant="h5">
            Service Learning Volunteering Admin Site
          </Typography>{' '}
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button
            variant="contained"
            style={{ marginTop: 10 }}
            onClick={props.signIn}
          >
            Sign In
          </Button>
        </div>

        <div style={{ marginTop: 100, textAlign: 'right', marginRight: 20 }}>
          <Typography>
            <i>
              Please use a pre-authorized email to login
            </i>
          </Typography>
        </div>
      </Card>
    </div>
  </div>
);

export default SignIn;
