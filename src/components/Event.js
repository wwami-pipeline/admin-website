import React from 'react';
import FirebaseHelpers from '../utils/FirebaseHelpers';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  FormControlLabel,
  Button,
  Typography,
  TextField,
  IconButton
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';

/* eslint react/no-direct-mutation-state: "off" */

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventItems: props.eventItems
    };
  }

  updateField = (field, val) => {
    this.setState(prevState => {
      let eventItems = Object.assign({}, prevState.eventItems);
      eventItems[field] = val;
      return { eventItems };
    });
  };

  addField = () => {
    const name = prompt('Enter Field Name: ');
    if (Object.keys(this.state.eventItems).includes(name)) {
      alert('Error: Event already has that field.');
    } else {
      this.state.eventItems[name] = '';
      this.forceUpdate();
    }
  };

  deleteField = field => {
    this.setState(prevState => {
      let state = Object.assign({}, prevState);
      delete state.eventItems[field];
      return { state };
    });
  };

  saveEvent = () => {
    FirebaseHelpers.updateFirebase(
      FirebaseHelpers.firebasePath(
        this.props.location,
        this.props.org,
        this.props.index
      ),
      this.state.eventItems
    );
  };

  render() {
    return (
      <div
        style={{
          width: '90%',
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
              onClick={() => this.props.deleteEvent(this.props.index)}
              control={<Delete />}
            />
            <Typography variant="h6">
              {this.state.eventItems['Title']}
            </Typography>
          </ExpansionPanelSummary>

          {/* Map each field in this event*/}
          {Object.keys(this.state.eventItems)
            .sort((x, y) => {
              return (
                FirebaseHelpers.getOrderNumber(x) -
                FirebaseHelpers.getOrderNumber(y)
              );
            })
            .map(field => (
              <div>
                <IconButton
                  style={{ display: 'inline-block' }}
                  onClick={() => this.deleteField(field)}
                >
                  <Delete />
                </IconButton>
                <div style={{ width: '85%', display: 'inline-block' }}>
                  <TextField
                    label={field}
                    variant="outlined"
                    multiline
                    fullWidth
                    value={this.state.eventItems[field]}
                    onChange={evt => this.updateField(field, evt.target.value)}
                  />
                </div>
              </div>
            ))}

          {/* EVENT BUTTONS */}
          <div style={{ marginTop: 20, marginLeft: 10, marginBottom: 10 }}>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={this.saveEvent}
            >
              Save
            </Button>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={this.addField}
            >
              Add {this.state.eventItems['Title']} Field
            </Button>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={() => this.refs.fileUploader.click()}
            >
              Set Photo
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                FirebaseHelpers.getUrl(
                  '/' +
                    this.props.location +
                    '/' +
                    this.props.org +
                    '/' +
                    this.state.eventItems['Title'] +
                    '.jpg'
                )
                  .then(url => {
                    const win = window.open(url, '_blank');
                    win.focus();
                  })
                  .catch(() => alert('No image set currently.'));
              }}
            >
              View Photo
            </Button>
          </div>
          <input
            type="file"
            id="file"
            ref="fileUploader"
            style={{ display: 'none' }}
            onChange={evt => {
              if (
                evt.target.files[0].name ===
                this.state.eventItems['Title'] + '.jpg'
              ) {
                FirebaseHelpers.uploadFile(
                  '/' +
                    this.props.location +
                    '/' +
                    this.props.org +
                    '/' +
                    evt.target.files[0].name,
                  evt.target.files[0]
                );
              } else {
                alert(
                  'ERROR: File name must be ' +
                    this.state.eventItems['Title'] +
                    '.jpg'
                );
              }
            }}
          />
        </ExpansionPanel>
      </div>
    );
  }
}

export default Event;
