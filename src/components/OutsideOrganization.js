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
import { withSnackbar } from 'notistack';

/* eslint react/no-direct-mutation-state: "off" */

const OrgTypes = {
  STUDENT: 'studentGroupItems',
  COMMITTEE: 'committeeItems',
};

class OutsideOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      useCustomIndexCommittee: false,
      useCustomIndexStudent: false,
      committeeIndex: 0,
      studentIndex: 0,
      studentGroupItems: [],
      committeeItems: [],
    };
    if (props.items) {
      if (props.items['Committees']) {
        Object.keys(props.items['Committees']).forEach((key) => {
          this.addItem(props.items['Committees'][key], OrgTypes.COMMITTEE);
        });
      }
      if (props.items['StudentInterestGroups']) {
        Object.keys(props.items['StudentInterestGroups']).forEach((key) => {
          this.addItem(
            props.items['StudentInterestGroups'][key],
            OrgTypes.STUDENT
          );
        });
      }
    }
  }

  updateField = (committeeIndex, val, orgType) => {
    this.setState((prevState) => {
      let items = prevState[orgType];
      items[committeeIndex].value = val;
      return { [orgType]: items };
    });
  };

  addItem = (item, orgType) => {
    if (orgType === OrgTypes.COMMITTEE) {
      if (this.state.useCustomIndexCommittee) {
        // Insert item at custom committeeIndex
        this.state[orgType].splice(this.state.committeeIndex, 0, item);
      } else {
        this.state[orgType].push(item);
      }
    } else if (orgType === OrgTypes.STUDENT) {
      if (this.state.useCustomIndexStudent) {
        // Insert item at custom committeeIndex
        this.state[orgType].splice(this.state.studentIndex, 0, item);
      } else {
        this.state[orgType].push(item);
      }
    }
  };

  addParagraph = (orgType) => {
    this.addItem({ type: 'paragraph', value: '' }, orgType);
    this.forceUpdate();
  };

  addSubsectionTitle = (orgType) => {
    this.addItem({ type: 'subsection-title', value: '' }, orgType);
    this.forceUpdate();
  };

  addSectionTitle = (orgType) => {
    this.addItem({ type: 'section-title', value: '' }, orgType);
    this.forceUpdate();
  };

  addItalicized = (orgType) => {
    this.addItem({ type: 'italics', value: '' }, orgType);
    this.forceUpdate();
  };

  deleteField = (committeeIndex, orgType) => {
    this.setState((prevState) => {
      let state = Object.assign({}, prevState);
      delete state[orgType][committeeIndex];
      return { state };
    });
  };

  save = () => {
    if (this.state.title) {
      FirebaseHelpers.updateFirebase(
        '/OutsideOrganizations/' + this.state.title,
        {
          Committees: this.state.committeeItems,
          StudentInterestGroups: this.state.studentGroupItems,
        }
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
            <Typography variant="h4">{this.state.title}</Typography>
          </ExpansionPanelSummary>

          {/* COMMITTEE SECTION */}
          <div
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '0.5em',
            }}
          >
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4">Committees</Typography>
              </ExpansionPanelSummary>
              {/* Map each field in this event*/}
              <div style={{ maxHeight: 800, overflowY: 'scroll' }}>
                {this.state[OrgTypes.COMMITTEE].map((val, index) => (
                  <div style={{ marginLeft: 7 }}>
                    {index}
                    <IconButton
                      style={{ display: 'inline-block' }}
                      onClick={() =>
                        this.deleteField(index, OrgTypes.COMMITTEE)
                      }
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
                          this.updateField(
                            index,
                            evt.target.value,
                            OrgTypes.COMMITTEE
                          )
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
                  onClick={() => this.addParagraph(OrgTypes.COMMITTEE)}
                >
                  Add Paragraph
                </Button>
                <Button
                  style={{ marginRight: 10 }}
                  variant="contained"
                  onClick={() => this.addItalicized(OrgTypes.COMMITTEE)}
                >
                  Add Italics
                </Button>
                <Button
                  style={{ marginRight: 10 }}
                  variant="contained"
                  onClick={() => this.addSubsectionTitle(OrgTypes.COMMITTEE)}
                >
                  Add Subsection Title
                </Button>
                <Button
                  style={{ marginRight: 10 }}
                  variant="contained"
                  onClick={() => this.addSectionTitle(OrgTypes.COMMITTEE)}
                >
                  Add Section Title
                </Button>

                <FormControlLabel
                  control={
                    <Checkbox
                      value={this.state.useCustomIndexCommittee}
                      onChange={(val) =>
                        this.setState({
                          useCustomIndexCommittee: val.target.value,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Specify Insert Location?"
                  labelPlacement="bottom"
                />

                {this.state.useCustomIndexCommittee ? (
                  <TextField
                    label="Insert Index"
                    value={this.state.committeeIndex}
                    onChange={(val) =>
                      this.setState({ committeeIndex: val.target.value })
                    }
                    type="number"
                  />
                ) : (
                  <div />
                )}
              </div>
            </ExpansionPanel>
          </div>

          {/* STUDENT INTEREST GROUP SECTION */}
          <div
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            }}
          >
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4">Student Interest Groups</Typography>
              </ExpansionPanelSummary>
              {/* Map each field in this event*/}
              <div style={{ maxHeight: 800, overflowY: 'scroll' }}>
                {this.state.studentGroupItems.map((val, index) => (
                  <div style={{ marginLeft: 7 }}>
                    {index}
                    <IconButton
                      style={{ display: 'inline-block' }}
                      onClick={() => this.deleteField(index, OrgTypes.STUDENT)}
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
                          this.updateField(
                            index,
                            evt.target.value,
                            OrgTypes.STUDENT
                          )
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
                  onClick={() => this.addParagraph(OrgTypes.STUDENT)}
                >
                  Add Paragraph
                </Button>
                <Button
                  style={{ marginRight: 10 }}
                  variant="contained"
                  onClick={() => this.addItalicized(OrgTypes.STUDENT)}
                >
                  Add Italics
                </Button>
                <Button
                  style={{ marginRight: 10 }}
                  variant="contained"
                  onClick={() => this.addSubsectionTitle(OrgTypes.STUDENT)}
                >
                  Add Subsection Title
                </Button>
                <Button
                  style={{ marginRight: 10 }}
                  variant="contained"
                  onClick={() => this.addSectionTitle(OrgTypes.STUDENT)}
                >
                  Add Section Title
                </Button>

                <FormControlLabel
                  control={
                    <Checkbox
                      value={this.state.useCustomIndexStudent}
                      onChange={(val) =>
                        this.setState({
                          useCustomIndexStudent: val.target.value,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Specify Insert Location?"
                  labelPlacement="bottom"
                />

                {this.state.useCustomIndexStudent ? (
                  <TextField
                    label="Insert Index"
                    value={this.state.studentIndex}
                    onChange={(val) =>
                      this.setState({ studentIndex: val.target.value })
                    }
                    type="number"
                  />
                ) : (
                  <div />
                )}
              </div>
            </ExpansionPanel>
          </div>
          <Button
            style={{ marginLeft: 10, marginBottom: 10 }}
            variant="contained"
            onClick={() => {
              this.save();
              this.props.enqueueSnackbar(
                this.state.title + ' outside organizations saved'
              );
            }}
          >
            Save
          </Button>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withSnackbar(OutsideOrganization);
