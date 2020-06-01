import React from 'react';
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
} from '@material-ui/core';

import Resource from './Resource';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class ResourceTopLevel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: props.resources,
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
            <Typography variant="h4">Resources</Typography>
          </ExpansionPanelSummary>
          <Resource
            items={this.state.resources["Service Learning Website Links"]}
            title="Service Learning Website Links"
          />
          <Resource
            items={this.state.resources['Service Learning Training Videos']}
            title="Service Learning Training Videos"
          />
          <Resource
            items={this.state.resources['Protocols']}
            title="Protocols"
          />
          <Resource
            items={this.state.resources['Teaching Tools']}
            title="Teaching Tools"
          />
        </ExpansionPanel>
      </div>
    );
  }
}

export default ResourceTopLevel;
