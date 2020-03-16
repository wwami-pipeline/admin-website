import React from 'react';
import FirebaseHelpers from '../utils/FirebaseHelpers';
import Event from './Event';
import {
  Grid,
  Typography,
  ExpansionPanel,
  FormControlLabel,
  ExpansionPanelSummary,
  Button
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';

/* eslint react/no-direct-mutation-state: "off" */
/* eslint no-restricted-globals: "off" */

class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgName: props.org,
      orgData: props.orgData
    };
    if (this.state.orgData === undefined) {
      this.addEvent();
    }
  }

  addEvent = () => {
    const keys = Object.keys(this.state.orgData);
    const index = keys.length === 0 ? 0 : Number(keys[keys.length - 1]) + 1;

    this.setState(prevState => {
      let state = Object.assign({}, prevState);
      state.orgData[index] = {
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

  addOtherEvent = () => {
    const keys = Object.keys(this.state.orgData);
    const index = keys.length === 0 ? 0 : Number(keys[keys.length - 1]) + 1;
    this.setState(prevState => {
      let state = Object.assign({}, prevState);
      state.orgData[index] = {
        Title: '',
        'Sign-up Link': '',
        'Project Description': '',
        Location: ''
      };
      return { state };
    });
  };

  deleteEvent = index => {
    if (confirm('Are you sure you wish to delete this event?')) {
      delete this.state.orgData[index];
      for (let i = index + 1; i < Object.keys(this.state.orgData).length; i++) {
        this.state.orgData[index - 1] = this.state.orgData[index];
      }
      FirebaseHelpers.updateFirebase(
        '/' + this.props.location + '/' + this.state.orgName,
        this.state.orgData
      );
    }
    this.forceUpdate()
  };

  render() {
    return (
      <div
        style={{
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '1em'
        }}
      >
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <FormControlLabel
              aria-label="Delete Organization"
              onClick={() =>
                this.props.deleteOrg(this.props.org)
              }
              control={<Delete />}
            />
            <Typography variant="h5">{this.state.orgName}</Typography>
          </ExpansionPanelSummary>

          <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <Grid container spacing={3}>
              {/* Map each event of this organization */}
              {Object.keys(this.state.orgData).map(index => (
                <Event
                  eventItems={this.state.orgData[index]}
                  location={this.props.location}
                  org={this.props.org}
                  index={index}
                  deleteEvent={this.deleteEvent}
                />
              ))}
            </Grid>
          </div>

          {/* ORGANIZATION BUTTONS */}
          {/* <Button
          variant="contained"
          style={{ marginTop: 10 }}
          onClick={() => props.fixEventItemsOrdering(props.location, props.org)}
        >
          Fix {props.org}
        </Button> */}
          <div style={{ marginTop: 20, marginLeft: 10, marginBottom: 10 }}>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={() =>
                this.state.orgName.toLowerCase() === 'others'
                  ? this.addOtherEvent()
                  : this.addEvent()
              }
            >
              Add {this.props.org} Event
            </Button>
            {this.state.orgName.toLowerCase() === 'others' ? (
              <div />
            ) : (
              <Button
                variant="contained"
                onClick={() =>
                  this.props.renameOrg(this.props.location, this.props.org)
                }
              >
                Rename {this.state.orgName}
              </Button>
            )}
          </div>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Organization;
