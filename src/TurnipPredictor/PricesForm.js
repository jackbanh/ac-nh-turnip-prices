import _ from 'underscore';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  today: {
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },

  textField: {
    minWidth: '120px',
  },
}));

export default function PricesForm(props) {
  const classes = useStyles();
  const {
    prices,
    onChange,
    today,
  } = props;

  const { buyPrice, days } = prices;

  const handleBuyPriceChange = useCallback(e => {
    onChange({ buyPrice: e.target.value });
  }, [onChange]);

  const handleDayChange = useCallback(e => {
    const { target } = e;

    const newDays = [...days];
    const i = _.findIndex(days, day => day.id === target.dataset.id);

    if (i >= 0) {
      const newDay = { ...newDays[i] };
      newDay[target.dataset.column] = target.value;

      newDays[i] = newDay;

      onChange({ days: newDays });
    }
  }, [days, onChange]);

  const handleWheel = useCallback(e => {
    // by default number inputs will catch mousewheel events and use it to change the value
    e.target.blur();
  }, []);

  if (_.isEmpty(prices)) {
    return null;
  }

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>AM</TableCell>
              <TableCell>PM</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={today === 'Sunday' ? classes.today : null}>
              <TableCell>Sunday</TableCell>
              <TableCell colSpan={2}>
                <TextField
                  className={classes.textField}
                  type="number"
                  label="Purchase price"
                  value={buyPrice}
                  onChange={handleBuyPriceChange}
                  inputProps={{ min: 1, max: 1000 }}
                  onWheel={handleWheel}
                />
              </TableCell>
            </TableRow>
            {_.map(days, day => (
              <TableRow key={day.id} className={today === day.id ? classes.today : null}>
                <TableCell>{day.id}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={day.am}
                    onChange={handleDayChange}
                    inputProps={{
                      min: 1,
                      max: 1000,
                      'data-id': day.id,
                      'data-column': 'am',
                    }}
                    onWheel={handleWheel}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={day.pm}
                    onChange={handleDayChange}
                    inputProps={{
                      min: 1,
                      max: 1000,
                      'data-id': day.id,
                      'data-column': 'pm',
                    }}
                    onWheel={handleWheel}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

PricesForm.propTypes = {
  prices: PropTypes.shape({
    buyPrice: PropTypes.string,
    days: PropTypes.arrayOf(PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    })),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  today: PropTypes.string.isRequired,
};
