import React from 'react';
import FirebaseHelpers from '../utils/FirebaseHelpers';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  FormControlLabel,
  Button,
  Typography,
  TextField,
  IconButton,
} from '@material-ui/core';
import DateDialog from './DateDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';

/* eslint react/no-direct-mutation-state: "off" */

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      eventItems: props.eventItems,
    };
  }

  // Add event calendar occurrence
  addDate = (rrule, startTime, duration) => {
    if (rrule === undefined || rrule === '') {
      alert('Invalid date range. Please select a date.');
    } else {
      if (this.state.eventItems['Dates']) {
        const length = Object.keys(this.state.eventItems['Dates']).length;
        this.state.eventItems['Dates'][length] = { rrule, startTime, duration };
      } else {
        this.state.eventItems['Dates'] = {
          0: { rrule, startTime, duration },
        };
      }
      this.forceUpdate();
    }
  };

  removeDate = (rrule) => {
    if (this.state.eventItems['Dates']) {
      const length = Object.keys(this.state.eventItems['Dates']).length;
      let currIndex = 0;
      while (
        this.state.eventItems['Dates'][currIndex] !== rrule &&
        currIndex < length
      ) {
        currIndex++;
      }
      if (currIndex === 0 && length === 1) {
        delete this.state.eventItems['Dates'];
      } else {
        for (let i = currIndex + 1; i < length; i++) {
          this.state.eventItems['Dates'][i - 1] = this.state.eventItems[
            'Dates'
          ][i];
        }
        delete this.state.eventItems['Dates'][length - 1];
      }
      this.forceUpdate();
    }
  };

  updateField = (field, val) => {
    this.setState((prevState) => {
      let eventItems = Object.assign({}, prevState.eventItems);
      eventItems[field] = val;
      return { eventItems };
    });
  };

  addField = () => {
    const name = prompt('Enter Field Name: ');
    if (name === undefined || name === '' || name === null) {
      alert('Invalid name. Aborting add.');
    } else if (
      Object.keys(this.state.eventItems).includes(name) ||
      name === 'Dates'
    ) {
      alert('Error: Event already has that field.');
    } else {
      this.state.eventItems[name] = '';
      this.forceUpdate();
    }
  };

  deleteField = (field) => {
    this.setState((prevState) => {
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
          marginTop: '1em',
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
            .filter((key) => key !== 'Dates')
            .sort((x, y) => {
              return (
                FirebaseHelpers.getOrderNumber(x) -
                FirebaseHelpers.getOrderNumber(y)
              );
            })
            .map((field) => (
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
                    onChange={(evt) =>
                      this.updateField(field, evt.target.value)
                    }
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
              onClick={() => this.setState({ dialogOpen: true })}
            >
              Set Calendar Dates
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
                  .then((url) => {
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
            onChange={(evt) => {
              // Ensure that file name is what is desired
              const fileName = evt.target.files[0].name;
              const finalFileName = this.state.eventItems['Title'] + '.jpg';
              if (
                typeof fileName === 'string' &&
                fileName.substr(fileName.length - 4) === '.jpg'
              ) {
                const blob = evt.target.files[0].slice(
                  0,
                  evt.target.files[0].size,
                  'image/jpg'
                );
                const fileToUpload = new File([blob], finalFileName, {
                  type: 'image/jpg',
                });
                FirebaseHelpers.uploadFile(
                  '/' +
                    this.props.location +
                    '/' +
                    this.props.org +
                    '/' +
                    finalFileName,
                  fileToUpload
                );
              } else if (
                typeof fileName === 'string' &&
                fileName.substr(fileName.length - 5) === '.jpeg'
              ) {
                const blob = evt.target.files[0].slice(
                  0,
                  evt.target.files[0].size,
                  'image/jpeg'
                );
                const fileToUpload = new File([blob], finalFileName, {
                  type: 'image/jpg',
                });
                FirebaseHelpers.uploadFile(
                  '/' +
                    this.props.location +
                    '/' +
                    this.props.org +
                    '/' +
                    finalFileName,
                  fileToUpload
                );
              } else {
                alert(
                  'ERROR: Invalid file type. Must be .jpg. Convert at jpg2png.com'
                );
              }
            }}
          />
        </ExpansionPanel>
        <DateDialog
          open={this.state.dialogOpen}
          handleClose={() => this.setState({ dialogOpen: false })}
          dates={this.state.eventItems['Dates']}
          addDate={this.addDate}
          removeDate={this.removeDate}
        />
      </div>
    );
  }
}

export default Event;
