import React from 'react';
import {
  Grid,
  IconButton,
  Card,
  Button,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  TextField,
  CardContent,
  CardHeader
} from '@material-ui/core';

import { Delete } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Overviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Overviews: props.data['Overviews']
    };
  }

  addOverview = () => {
    const name = prompt('Enter Org Name: ');
    this.setState(prevState => {
      let Overviews = Object.assign({}, prevState.Overviews);
      Overviews[name] = {
        Description: '',
        Video: ''
      };
      return { Overviews };
    });
  };

  deleteOverviewOrg = org => {
    this.setState(prevState => {
      let Overviews = Object.assign({}, prevState.Overviews);
      delete Overviews[org];
      return { Overviews };
    });
  };

  changeItemValue = (org, field, val) => {
    this.setState(prevState => {
      let Overviews = Object.assign({}, prevState.Overviews);
      Overviews[org][field] = val;
      return { Overviews };
    });
  };

  render() {
    return (
      <div
        style={{
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
          flexGrow: 1
        }}
      >
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4">Overviews</Typography>
          </ExpansionPanelSummary>
          <div
            style={{ width: '95%', marginLeft: 'auto', marginRight: 'auto' }}
          >
            <Grid container spacing={3}>
              {Object.keys(this.state.Overviews).map(org => (
                <Grid item xs={3}>
                  <Card
                    variant="outlined"
                    style={{
                      height: 275,
                      maxWidth: 1000,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      overflow: 'scroll'
                    }}
                  >
                    <CardHeader
                      action={
                        <IconButton
                          aria-label="delete"
                          onClick={() => this.deleteOverviewOrg(org)}
                        >
                          <Delete />
                        </IconButton>
                      }
                      title={<Typography variant="h4">{org}</Typography>}
                    ></CardHeader>
                    <CardContent>
                      {Object.keys(this.state.Overviews[org]).map(field => (
                        <div
                          style={{
                            maxWidth: 900,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '1em'
                          }}
                        >
                          <TextField
                            label={field}
                            multiline
                            fullWidth
                            value={this.state.Overviews[org][field]}
                            onChange={evt =>
                              this.changeItemValue(org, field, evt.target.value)
                            }
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 5 }}>
              <Button
                style={{ marginRight: 5 }}
                variant="contained"
                onClick={() => this.props.updateOverviews(this.state.Overviews)}
              >
                Save Overviews
              </Button>
              <Button variant="contained" onClick={this.addOverview}>
                Add Overview
              </Button>
            </div>
          </div>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Overviews;
