import React from 'react';
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
} from '@material-ui/core';

import Prerequisites from './Prerequisites';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class PrerequisiteTopLevel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prerequisites: props.prerequisites,
    };
  }

  render() {
    return (
      <div
        style={{
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '1em',
          flexGrow: 1,
        }}
      >
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4">Requirements</Typography>
          </ExpansionPanelSummary>
          <Prerequisites
            prerequisites={this.state.prerequisites["Seattle"]}
            location="Seattle"
          />
          <Prerequisites
            prerequisites={this.state.prerequisites["Spokane"]}
            location="Spokane"
          />
          <Prerequisites
            prerequisites={this.state.prerequisites["Montana"]}
            location="Montana"
          />
          <Prerequisites
            prerequisites={this.state.prerequisites["Alaska"]}
            location="Alaska"
          />
          <Prerequisites
            prerequisites={this.state.prerequisites["Wyoming"]}
            location="Wyoming"
          />
          <Prerequisites
            prerequisites={this.state.prerequisites["Idaho"]}
            location="Idaho"
          />
        </ExpansionPanel>
      </div>
    );
  }
}

export default PrerequisiteTopLevel;
