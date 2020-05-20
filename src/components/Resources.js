import React from 'react';
import FirebaseHelpers from '../utils/FirebaseHelpers';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Button,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';

/* eslint react/no-direct-mutation-state: "off" */

class Resources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      useCustomIndex: false,
      index: 0,
      items: [],
    };
    if (props.items) {
      Object.keys(props.items).forEach((key) => {
        this.addItem(props.items[key]);
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

  addItem = (item) => {
    if (this.state.useCustomIndex) {
      // Insert item at custom index
      this.state.items.splice(this.state.index, 0, item);
    } else {
      this.state.items.push(item);
    }
  };

  addParagraph = () => {
    this.addItem({ type: 'paragraph', value: '' });
    this.forceUpdate();
  };

  addSubsectionTitle = () => {
    this.addItem({ type: 'subsection-title', value: '' });
    this.forceUpdate();
  };

  addSectionTitle = () => {
    this.addItem({ type: 'section-title', value: '' });
    this.forceUpdate();
  };

  addItalicized = () => {
    this.addItem({ type: 'italics', value: '' });
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
    FirebaseHelpers.updateFirebase('/Resources', this.state.items);
  };

  render() {
    return (
      <div
        style={{
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '1em',
          marginBottom: '.5em',
        }}
      >
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4">Resources</Typography>
          </ExpansionPanelSummary>

          {/* Map each field in this event*/}
          <div style={{ maxHeight: 800, overflowY: 'scroll' }}>
            {this.state.items.map((val, index) => (
              <div style={{ marginLeft: 7 }}>
                {index}
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
                    onChange={(evt) =>
                      this.updateField(index, evt.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

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
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={this.addSubsectionTitle}
            >
              Add Subsection Title
            </Button>
            <Button
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={this.addSectionTitle}
            >
              Add Section Title
            </Button>

            <FormControlLabel
              control={
                <Checkbox
                  value={this.state.useCustomIndex}
                  onChange={(val) =>
                    this.setState({ useCustomIndex: val.target.value })
                  }
                  color="primary"
                />
              }
              label="Specify Insert Location?"
              labelPlacement="bottom"
            />

            {this.state.useCustomIndex ? (
              <TextField
                label="Insert Index"
                value={this.state.index}
                onChange={(val) => this.setState({ index: val.target.value })}
                type="number"
              />
            ) : (
              <div />
            )}
          </div>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Resources;
