import React from 'react';
import Event from './Event';
import {
  Grid,
  Typography,
  ExpansionPanel,
  FormControlLabel,
  ExpansionPanelSummary,
  Button
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Delete } from '@material-ui/icons';

const Organization = props => (
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
          aria-label="Delete Organization"
          onClick={() => props.deleteItem(props.location, props.org)}
          control={<Delete />}
        />
        <Typography variant="h5">{props.org}</Typography>
      </ExpansionPanelSummary>

      <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <Grid container spacing={3}>
          {/* Map each event of this organization */}
          {Object.keys(props.data[props.location][props.org]).map(index => (
            <Event
              data={props.data}
              location={props.location}
              org={props.org}
              index={index}
              getOrderNumber={props.getOrderNumber}
              deleteItem={props.deleteItem}
              updateEvent={props.updateEvent}
            />
          ))}
        </Grid>
      </div>

      {/* ORGANIZATION BUTTONS */}
      {/* <Button
        variant="contained"
        style={{ marginTop: 10 }}
        onClick={() => props.fixEventItemsOrdering(props.location, props.org)}
      >
        Fix {props.org}
      </Button> */}
      <div style={{ marginTop: 20, marginLeft: 10, marginBottom: 10 }}>
        <Button
          variant="contained"
          onClick={() => props.addEvent(props.location, props.org)}
        >
          Add {props.org} Event
        </Button>
      </div>
    </ExpansionPanel>
  </div>
);

export default Organization;
