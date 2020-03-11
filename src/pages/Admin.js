import React from 'react';
import FirebaseHelpers from '../utils/FirebaseHelpers';
import firebase from 'firebase';
import Location from '../components/Location';
import Overviews from '../components/Overviews';
import { Typography, Button } from '@material-ui/core';

/* eslint react/no-direct-mutation-state: "off" */
/* eslint no-restricted-globals: "off" */

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.data === undefined,
      dialogOpen: false,
      data: props.data === undefined ? {} : props.data
    };
    if (props.data === undefined) {
      firebase
        .database()
        .ref()
        .once('value')
        .then(value => {
          this.state.loading = false;
          this.state.data = value.toJSON();
          this.forceUpdate();
        });
    }
  }

  addEvent = (location, org) => {
    const keys = Object.keys(this.state.data[location][org]);
    const index = keys.length === 0 ? 0 : Number(keys[keys.length - 1]) + 1;

    this.setState(prevState => {
      let state = Object.assign({}, prevState);
      state.data[location][org][index] = {
        Title: '',
        'Sign-up Link': '',
        'Project Description': '',
        'Types of Volunteers Needed': '',
        'Clinic Schedule': '',
        Location: '',
        'Parking and Directions': '',
        'Provider Information': '',
        'HS Grad Student Information': '',
        'Undergraduate Information': '',
        'Project Specific Training': '',
        'Tips and Reminders': '',
        'Contact Information and Cancellation Policy': '',
        'Services Provided': '',
        'Clinic Flow': '',
        'Website Link': ''
      };
      return { state };
    });
  };

  addOrg = location => {
    const name = prompt('Organization name: ');
    this.state.data[location][name] = {};
    this.addEvent(location, name);
  };

  renameOrg = (location, org) => {
    const newName = prompt('New Organization Name: ');
    if (
      !(typeof newName === 'undefined' || newName === org || newName === '')
    ) {
      this.state.data[location][newName] = this.state.data[location][org];
      delete this.state.data[location][org];
      FirebaseHelpers.updateFirebase(
        FirebaseHelpers.firebasePath(location),
        this.state.data[location]
      );
      this.forceUpdate();
    }
  };

  addLocation = () => {
    const name = prompt('Location name: ');
    this.state.data[name] = {};
    this.addOrg(name);
  };

  deleteItem = (location, org, index, field) => {
    if (field != null) {
      // Delete Field
      delete this.state.data[location][org][index][field];
    } else {
      if (index != null) {
        // Delete Event
        if (confirm('Are you sure you wish to delete this event?')) {
          delete this.state.data[location][org][index];
          for (
            let i = index + 1;
            i < Object.keys(this.state.data[location][org]).length;
            i++
          ) {
            this.state.data[location][org][index - 1] = this.state.data[
              location
            ][org][index];
          }
          FirebaseHelpers.updateFirebase(
            '/' + location + '/' + org,
            this.state.data[location][org]
          );
        }
      } else {
        if (org != null) {
          // Delete Org
          if (confirm('Are you sure you wish to delete this organization?')) {
            delete this.state.data[location][org];
            FirebaseHelpers.updateFirebase(
              '/' + location,
              this.state.data[location]
            );
          }
        } else {
          // Delete location
          if (confirm('Are you sure you wish to delete this location?')) {
            delete this.state.data[location];
            FirebaseHelpers.updateFirebase('/', this.state.data);
          }
        }
      }
    }

    this.forceUpdate();
  };

  fixEventItemsOrdering = (location, org) => {
    const keys = Object.keys(this.state.data[location][org]);
    let temp = {};
    for (let i = 0; i < keys.length; i++) {
      temp[i] = this.state.data[location][org][keys[i]];
    }
    this.state.data[location][org] = temp;
    FirebaseHelpers.updateFirebase(
      FirebaseHelpers.firebasePath(location, org),
      this.state.data[location][org]
    );
    this.forceUpdate();
  };

  updateEvent = (location, org, index, value) => {
    this.setState(prevState => {
      let state = Object.assign({}, prevState);
      state.data[location][org][index] = value;
      return { state };
    });
    FirebaseHelpers.updateFirebase(
      FirebaseHelpers.firebasePath(location, org, index),
      value
    );
  };

  updateOverviews = value => {
    this.setState(prevState => {
      let state = Object.assign({}, prevState);
      state['Overviews'] = value;
      return { state };
    });
    FirebaseHelpers.updateFirebase('/Overviews', value);
  };

  render() {
    if (this.state.loading) {
      return (
        <div
          style={{
            textAlgin: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '2em'
          }}
        >
          <Typography>Loading...</Typography>
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

        {/* OVERVIEWS */}
        <Overviews
          data={this.state.data}
          updateOverviews={this.updateOverviews}
        />
        {/* TOP-LEVEL LOCATIONS */}
        {Object.keys(this.state.data)
          .filter(x => x !== 'Overviews')
          .map(location => (
            <Location
              data={this.state.data}
              location={location}
              addOrg={this.addOrg}
              renameOrg={this.renameOrg}
              getOrderNumber={FirebaseHelpers.getOrderNumber}
              deleteItem={this.deleteItem}
              fixEventItemsOrdering={this.fixEventItemsOrdering}
              updateEvent={this.updateEvent}
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
