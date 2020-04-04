import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

export default function CreditsDialog(props) {
  const { onClose } = props;

  return (
    <Dialog {...props}>
      <DialogTitle id="alert-dialog-title">Credits</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span>Site by </span>
          <Link href="https://twitter.com/jackbanh">@jackbanh</Link>
          <span>. </span>
          <Link href="https://github.com/jackbanh/ac-nh-turnip-prices">Github</Link>
        </DialogContentText>
        <DialogContentText>
          <span>Based off the work of </span>
          <Link href="https://github.com/mikebryant/ac-nh-turnip-prices">mikebryant</Link>
          .
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreditsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};
