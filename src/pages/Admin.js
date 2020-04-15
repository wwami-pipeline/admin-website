import React from 'react';
import FirebaseHelpers from '../utils/FirebaseHelpers';
import firebase from 'firebase';
import Location from '../components/Location';
import Overviews from '../components/Overviews';
import HelpDialog from '../components/HelpDialog';
import { Typography, Button } from '@material-ui/core';

/* eslint react/no-direct-mutation-state: "off" */
/* eslint no-restricted-globals: "off" */

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.data === undefined,
      dialogOpen: false,
      data: props.data === undefined ? {} : props.data,
    };
    if (props.data === undefined) {
      firebase
        .database()
        .ref()
        .once('value')
        .then((value) => {
          this.state.loading = false;
          this.state.data = value.toJSON();
          this.forceUpdate();
        });
    }
  }

  addLocation = () => {
    const name = prompt('Location name: ');
    this.setState((prevState) => {
      let state = Object.assign({}, prevState);
      state.data['Locations'][name] = {};
      return { state };
    });
  };

  deleteLocation = (location) => {
    // Delete location
    if (confirm('Are you sure you wish to delete this location?')) {
      delete this.state.data['Locations'][location];
      FirebaseHelpers.updateFirebase(
        '/Locations',
        this.state.data['Locations']
      );
    }
    this.forceUpdate();
  };

  render() {
    if (this.state.loading) {
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
        <Typography style={{ marginTop: 10, marginBottom: '1em' }}>
          <i>
            <b>Note:</b> You must press save after editing and adding items for
            changes to take effect.
          </i>
        </Typography>

        <div style={{ marginBottom: '2em' }}>
          <HelpDialog />
        </div>

        {/* OVERVIEWS */}
        <Overviews data={this.state.data} />
        {/* TOP-LEVEL LOCATIONS */}
        {Object.keys(this.state.data['Locations']).map((location) => (
          <Location
            data={this.state.data['Locations']}
            location={location}
            deleteLocation={this.deleteLocation}
          />
        ))}
        <Button
          variant="contained"
          style={{ marginTop: '1em' }}
          onClick={this.addLocation}
        >
          Add Location
        </Button>
      </div>
    );
  }
}

export default Admin;
