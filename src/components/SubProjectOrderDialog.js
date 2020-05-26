import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import { ReactSortable } from 'react-sortablejs';

const styles = () => ({
  dialogContent: {
    height: 500,
  },
  dialogBorder: {
    height: '20px',
  },
  title: {
    marginBottom: '.5em',
  },
});

class SubProjectOrderDialog extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          fullWidth
        >
          <div className={classes.dialogBorder} />
          <DialogTitle>
            <Typography variant="h4" className={classes.textCaps}>
              Field Ordering
            </Typography>
            <Typography style={{ marginTop: 7 }}>
              <i>Click and drag on the field names to change their ordering.</i>
            </Typography>
          </DialogTitle>
          <div className={classes.dialogBody}>
            <DialogContent className={classes.dialogContent}>
              <ReactSortable
                list={this.props.orderObjArr}
                setList={(newState) => this.props.updateOrder(newState)}
              >
                {this.props.orderObjArr.map((item) => (
                  <div key={item.id} style={{ padding: '1em', cursor: 'move' }}>
                    {item.name}
                  </div>
                ))}
              </ReactSortable>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.handleClose} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </div>
          <div className={classes.dialogBorder} />
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(SubProjectOrderDialog);
