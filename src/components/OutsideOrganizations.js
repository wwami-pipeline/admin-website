import React from 'react';
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OutsideOrganization from './OutsideOrganization';

class OutsideOrganizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outsideOrgs: props.items,
      locations: [
        'Seattle',
        'Spokane',
        'Montana',
        'Alaska',
        'Idaho',
        'Wyoming',
      ],
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
            <Typography variant="h4">
              Outside Organizations (For Resources Page)
            </Typography>
          </ExpansionPanelSummary>
          {this.state.locations.map((location) => (
            <OutsideOrganization
              title={location}
              items={
                this.state.outsideOrgs ? this.state.outsideOrgs[location] : {}
              }
            />
          ))}
        </ExpansionPanel>
      </div>
    );
  }
}

export default OutsideOrganizations;
