import React from 'react';
import Organization from './Organization';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  FormControlLabel,
  Button
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';

const Location = props => (
  <div
    style={{
      width: '95%',
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
          onClick={() => props.deleteItem(props.location)}
          control={<Delete />}
        />
        <Typography variant="h4">{props.location}</Typography>
      </ExpansionPanelSummary>

      {/* Map each organization in this location */}
      {Object.keys(props.data[props.location]).map(org => (
        <div style={{ marginLeft: 10 }}>
          <Organization
            org={org}
            location={props.location}
            data={props.data}
            getOrderNumber={props.getOrderNumber}
            deleteItem={props.deleteItem}
            fixEventItemsOrdering={props.fixEventItemsOrdering}
            updateEvent={props.updateEvent}
            renameOrg={props.renameOrg}
          />
        </div>
      ))}
      {/* LOCATION-SPECIFIC BUTTONS */}
      <div style={{ marginTop: 20, marginLeft: 10, marginBottom: 10 }}>
        <Button
          variant="contained"
          onClick={() => props.addOrg(props.location)}
        >
          Add {props.location} Organization
        </Button>
      </div>
    </ExpansionPanel>
  </div>
);

export default Location;
