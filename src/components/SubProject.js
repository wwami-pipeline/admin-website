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
import SubProjectOrderDialog from './SubProjectOrderDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import RRule from 'rrule';

/* eslint react/no-direct-mutation-state: "off" */

// NOTE: we refer to sub projects as "events" in the database for simplicity
class SubProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateDialogOpen: false,
      orderDialogOpen: false,
      eventItems: props.eventItems,
    };

    // Store title and link separately as they are not draggable
    this.state.title = this.state.eventItems['Title']
      ? this.state.eventItems['Title']
      : '';
    this.state.link = this.state.eventItems['Sign-up Link']
      ? this.state.eventItems['Sign-up Link']
      : '';
    this.state.description = this.state.eventItems['Project Description']
      ? this.state.eventItems['Project Description']
      : '';

    this.state.order = [];
    if (this.state.eventItems['Order']) {
      Object.keys(this.state.eventItems['Order']).forEach((key) => {
        this.state.order.push(this.state.eventItems['Order'][key]);
      });
    } else {
      Object.keys(this.state.eventItems)
        .filter((x) => x !== 'Title' && x !== 'Sign-up Link')
        .sort((x, y) => {
          return (
            FirebaseHelpers.getOrderNumber(x) -
            FirebaseHelpers.getOrderNumber(y)
          );
        })
        .forEach((key) => {
          if (key !== 'Dates' && key !== 'Order') {
            this.state.order.push(key);
          }
        });
    }

    this.state.orderObjArr = [];
    this.state.order.forEach((item, index) => {
      this.state.orderObjArr.push({ id: 'id-' + index, name: item });
    });
  }

  // Add sub project calendar occurrence
  addDate = (
    startDate,
    startTime,
    duration,
    endDate,
    link,
    repeatStr,
    weekArray
  ) => {
    let repeat = undefined;
    let neverRepeat = repeatStr === 'never';

    let endDateUsed = endDate;
    if (!startTime || !(startTime instanceof Date)) {
      alert('Invalid start time');
      return;
    }
    if (startDate === undefined || !(startDate instanceof Date)) {
      alert('Invalid start date');
      return;
    }
    if (repeatStr === 'never') {
      endDateUsed = new Date(+new Date() + 86400000);
      repeat = RRule.WEEKLY;
    } else {
      if (repeatStr === 'daily') {
        repeat = RRule.DAILY;
      } else if (repeatStr === 'weekly') {
        repeat = RRule.WEEKLY;
      } else if (repeatStr === 'monthly') {
        repeat = RRule.MONTHLY;
      } else {
        alert('Invalid repeat');
        return;
      }
    }
    if (endDateUsed === undefined || !(endDateUsed instanceof Date)) {
      alert('Invalid end date');
      return;
    }

    startDate.setHours(startTime.getHours() - 7);
    startDate.setMinutes(startTime.getMinutes());

    const rrule =
      repeatStr === 'weekly'
        ? new RRule({
            freq: repeat,
            byweekday: weekArray,
            dtstart: startDate,
            until: endDate,
          })
        : new RRule({ freq: repeat, dtstart: startDate, until: endDate });

    if (this.state.eventItems['Dates']) {
      const length = Object.keys(this.state.eventItems['Dates']).length;
      this.state.eventItems['Dates'][length] = {
        rrule: rrule.toString(),
        duration,
        link,
        neverRepeat,
      };
    } else {
      this.state.eventItems['Dates'] = {
        0: {
          rrule: rrule.toString(),
          duration,
          link,
          neverRepeat,
        },
      };
    }
    console.log(this.state.eventItems);
    this.forceUpdate();
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
      alert('Error: SubProject already has that field.');
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
    this.state.eventItems['Title'] = this.state.title;
    this.state.eventItems['Project Description'] = this.state.description;
    this.state.eventItems['Sign-up Link'] = this.state.link;
    this.state.eventItems['Order'] = this.state.order;

    FirebaseHelpers.updateFirebase(
      FirebaseHelpers.firebasePath(
        this.props.location,
        this.props.org,
        this.props.index
      ),
      this.state.eventItems
    );

    this.props.enqueueSnackbar('Sub project saved.');
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

          <div style={{ maxHeight: 650, overflowY: 'scroll' }}>
            {/* Display title, sign up link, and project description separately as they are required */}
            <TextField
              style={{
                marginTop: '1em',
                marginBottom: '1em',
                width: '90%',
                marginLeft: '1em',
              }}
              label={'Title'}
              variant="outlined"
              multiline
              fullWidth
              value={this.state.title}
              onChange={(evt) => {
                this.setState({ title: evt.target.value });
              }}
            />
            {/* <TextField
              style={{
                marginBottom: '1em',
                width: '90%',
                marginLeft: '1em',
              }}
              label={'Sign-up Link'}
              variant="outlined"
              multiline
              fullWidth
              value={this.state.link}
              onChange={(evt) => {
                this.setState({ link: evt.target.value });
              }}
            /> */}
            <TextField
              style={{
                marginBottom: '1em',
                width: '90%',
                marginLeft: '1em',
              }}
              label={'Project Description'}
              variant="outlined"
              multiline
              fullWidth
              value={this.state.description}
              onChange={(evt) => {
                this.setState({ description: evt.target.value });
              }}
            />

            {/* Map each field in this sub project*/}
            {Object.keys(this.state.eventItems)
              .filter(
                (key) =>
                  key !== 'Dates' &&
                  key !== 'Title' &&
                  key !== 'Project Description' &&
                  key !== 'Sign-up Link' &&
                  key !== 'Order'
              )
              .sort((x, y) => {
                return (
                  this.state.order.indexOf(x) - this.state.order.indexOf(y)
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
          </div>

          {/* SUBPROJECT BUTTONS */}
          <div style={{ marginTop: 20, marginLeft: 10, marginBottom: 10 }}>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={this.saveEvent}
            >
              <b>Save</b>
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
              onClick={() => this.setState({ dateDialogOpen: true })}
            >
              Set Calendar Dates
            </Button>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={() => this.setState({ orderDialogOpen: true })}
            >
              Change Field Ordering
            </Button>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={() => this.refs.fileUploader.click()}
            >
              Set Subproject Photo
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
              View Subproject Photo
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
          open={this.state.dateDialogOpen}
          handleClose={() => this.setState({ dateDialogOpen: false })}
          dates={this.state.eventItems['Dates']}
          addDate={this.addDate}
          removeDate={this.removeDate}
        />
        <SubProjectOrderDialog
          open={this.state.orderDialogOpen}
          handleClose={() => this.setState({ orderDialogOpen: false })}
          orderObjArr={this.state.orderObjArr}
          updateOrder={(orderObjArr) => {
            let order = [];
            orderObjArr.forEach((item) => {
              order.push(item.name);
            });
            this.setState({ orderObjArr, order });
          }}
        />
      </div>
    );
  }
}

export default withSnackbar(SubProject);
