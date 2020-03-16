import React from 'react';
import FirebaseHelpers from '../utils/FirebaseHelpers';
import Organization from './Organization';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  FormControlLabel,
  Button
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';

/* eslint react/no-direct-mutation-state: "off" */
/* eslint no-restricted-globals: "off" */

class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationName: props.location,
      locationData: props.data[props.location]
    };
  }

  addOrg = () => {
    const name = prompt('Organization name: ');
    this.state.locationData[name] = {};
    this.forceUpdate();
  };

  renameOrg = org => {
    const newName = prompt('New Organization Name: ');
    if (
      !(typeof newName === 'undefined' || newName === org || newName === '')
    ) {
      this.state.locationData[newName] = this.state.locationData[org];
      delete this.state.locationData[org];
      FirebaseHelpers.updateFirebase(
        FirebaseHelpers.firebasePath(this.state.locationName),
        this.state.locationData
      );
      this.forceUpdate();
    }
  };

  deleteOrg = org => {
    if (confirm('Are you sure you wish to delete this organization?')) {
      delete this.state.locationData[org];
      FirebaseHelpers.delete('/' + this.state.locationName);
      this.forceUpdate();
    }
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
              aria-label="Delete Location"
              onClick={() => this.props.deleteLocation(this.state.locationName)}
              control={<Delete />}
            />
            <Typography variant="h4">{this.state.locationName}</Typography>
          </ExpansionPanelSummary>

          {/* Map each organization in this location */}
          {Object.keys(this.state.locationData).map(org => (
            <div style={{ marginLeft: 10 }}>
              <Organization
                org={org}
                location={this.props.location}
                orgData={this.state.locationData[org]}
                deleteOrg={this.deleteOrg}
                renameOrg={this.renameOrg}
              />
            </div>
          ))}
          {/* LOCATION-SPECIFIC BUTTONS */}
          <div style={{ marginTop: 20, marginLeft: 10, marginBottom: 10 }}>
            <Button variant="contained" onClick={this.addOrg}>
              Add {this.state.locationName} Organization
            </Button>
          </div>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Location;
