import React from 'react';
import FirebaseHelpers from '../utils/FirebaseHelpers';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Button,
  Typography,
  TextField,
  IconButton,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';

/* eslint react/no-direct-mutation-state: "off" */

class Prerequisite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      items: [],
    };
    if (props.items) {
      Object.keys(props.items).forEach((key) => {
        this.state.items.push(props.items[key]);
      });
    }
  }

  updateField = (index, val) => {
    this.setState((prevState) => {
      let items = prevState.items;
      items[index].value = val;
      return { items };
    });
  };

  addParagraph = () => {
    this.state.items.push({ type: 'paragraph', value: '' });
    this.forceUpdate();
  };

  addSubsectionTitle = () => {
    this.state.items.push({ type: 'title', value: '' });
    this.forceUpdate();
  };

  addItalicized = () => {
    this.state.items.push({ type: 'italics', value: '' });
    this.forceUpdate();
  };

  deleteField = (index) => {
    this.setState((prevState) => {
      let state = Object.assign({}, prevState);
      delete state.items[index];
      return { state };
    });
  };

  save = () => {
    if (this.state.title) {
      FirebaseHelpers.updateFirebase(
        '/Prerequisites/' + this.state.title,
        this.state.items
      );
    }
  };

  render() {
    return (
      <div
        style={{
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '.5em',
          marginBottom: '.5em',
        }}
      >
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">{this.state.title}</Typography>
          </ExpansionPanelSummary>

          {/* Map each field in this event*/}
          {this.state.items.map((val, index) => (
            <div>
              <IconButton
                style={{ display: 'inline-block' }}
                onClick={() => this.deleteField(index)}
              >
                <Delete />
              </IconButton>
              <div style={{ width: '85%', display: 'inline-block' }}>
                <TextField
                  label={val.type}
                  variant="outlined"
                  multiline
                  fullWidth
                  value={val.value}
                  onChange={(evt) => this.updateField(index, evt.target.value)}
                />
              </div>
            </div>
          ))}

          {/* EVENT BUTTONS */}
          <div style={{ marginTop: 20, marginLeft: 10, marginBottom: 10 }}>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={this.save}
            >
              Save
            </Button>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={this.addParagraph}
            >
              Add Paragraph
            </Button>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={this.addItalicized}
            >
              Add Italics
            </Button>
            <Button variant="contained" onClick={this.addSubsectionTitle}>
              Add Subsection Title
            </Button>
          </div>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Prerequisite;
