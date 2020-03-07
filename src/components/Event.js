import React from 'react';
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
      eventItems: props.data[props.location][props.org][props.index]
    };
  }

  updateField = (field, val) => {
    this.setState(prevState => {
      let eventItems = Object.assign({}, prevState.eventItems);
      eventItems[field] = val;
      return { eventItems };
    });
  };

  addItem = () => {
    const name = prompt('Enter Field Name: ');
    if (Object.keys(this.state.eventItems).includes(name)) {
      alert('Error: Event already has that field.');
    } else {
      this.state.eventItems[name] = '';
      this.forceUpdate();
    }
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
              onClick={() =>
                this.props.deleteItem(
                  this.props.location,
                  this.props.org,
                  this.props.index
                )
              }
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
                this.props.getOrderNumber(x) - this.props.getOrderNumber(y)
              );
            })
            .map(field => (
              <div>
                <IconButton
                  style={{ display: 'inline-block' }}
                  onClick={() =>
                    this.props.deleteItem(
                      this.props.location,
                      this.props.org,
                      this.props.index,
                      field
                    )
                  }
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
              onClick={() => {
                this.props.updateEvent(
                  this.props.location,
                  this.props.org,
                  this.props.index,
                  this.state.eventItems
                );
              }}
            >
              Save
            </Button>
            <Button variant="contained" onClick={this.addItem}>
              Add {this.state.eventItems['Title']} Field
            </Button>
          </div>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Event;
