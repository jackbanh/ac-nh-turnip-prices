/* eslint-disable max-len */

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
          Site by <Link href="https://twitter.com/jackbanh">@jackbanh</Link> (<Link href="https://github.com/jackbanh/ac-nh-turnip-prices">Github</Link>).
        </DialogContentText>
        <DialogContentText>
          Based off the work of <Link href="https://turnipprophet.io/">mikebryant</Link> (<Link href="https://github.com/mikebryant/ac-nh-turnip-prices">Github</Link>) and <Link href="https://twitter.com/_Ninji/status/1244818665851289602">Ninji</Link>.
        </DialogContentText>
        <DialogContentText>
          These calculations work off your own island&apos;s buy and sell prices. It will not work if you mix prices from different islands.
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
