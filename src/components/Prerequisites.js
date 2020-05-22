import React from 'react';
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
} from '@material-ui/core';

import Prerequisite from './Prerequisite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Prerequisites extends React.Component {
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
          {Object.keys(this.state.prerequisites).map((key) => (
            <Prerequisite title={key} items={this.state.prerequisites[key]} />
          ))}
        </ExpansionPanel>
      </div>
    );
  }
}

export default Prerequisites;
