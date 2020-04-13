import _ from 'underscore';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default function Day(props) {
  const {
    day,
    inputProps,
    onChange,
    onWheel,
  } = props;

  return (
    <div className="day">
      <Typography variant="h6">{day.id}</Typography>
      <Grid container>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="am"
            value={day.am}
            size="small"
            inputProps={{
              ...inputProps,
              'data-id': day.id,
              'data-column': 'am',
            }}
            onChange={onChange}
            onWheel={onWheel}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="pm"
            size="small"
            value={day.pm}
            inputProps={{
              ...inputProps,
              'data-id': day.id,
              'data-column': 'pm',
            }}
            onChange={onChange}
            onWheel={onWheel}
          />
        </Grid>
      </Grid>
    </div>
  );
}

Day.propTypes = {
  day: PropTypes.shape({
    id: PropTypes.string,
    am: PropTypes.string,
    pm: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onWheel: PropTypes.func,
  inputProps: PropTypes.shape({}),
};

Day.defaultProps = {
  onWheel: _.noop,
  inputProps: {},
};
