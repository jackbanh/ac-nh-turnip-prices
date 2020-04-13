import _ from 'underscore';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';

import Day from './Day';

const useStyles = makeStyles(theme => ({
  pricesForm: {
    '& .buy-price': {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },

    '& .sell-prices': {
      marginBottom: theme.spacing(2),

      '& .day': {
        paddingLeft: theme.spacing(1),
        marginBottom: theme.spacing(2),
      },
    },

    '& .previous-pattern': {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(3),
    },
  },

  today: {
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

export default function PricesForm(props) {
  const classes = useStyles();
  const {
    prices,
    onChange,
    today,
    maxPrice,
  } = props;

  const { buyPrice, days, previousPattern } = prices;

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

  const inputProps = useMemo(() => ({ min: 1, max: maxPrice, pattern: '\\d*' }), [maxPrice]);

  const handlePreviousPatternChange = useCallback(e => {
    onChange({ previousPattern: e.target.value });
  }, [onChange]);

  if (_.isEmpty(prices)) {
    return null;
  }

  return (
    <div className={classes.pricesForm}>
      <Grid className="buy-price" container>
        <Grid item xs={12}>
          <Typography variant="h5">Daisy Mae</Typography>
          <TextField
            className="buy-price-input"
            type="number"
            label="Buy price"
            helperText="Only enter the buy and sell prices for your island"
            value={buyPrice}
            onChange={handleBuyPriceChange}
            inputProps={inputProps}
            onWheel={handleWheel}
          />
        </Grid>
      </Grid>
      <Grid className="sell-prices" container>
        {_.map(days, day => (
          <Grid
            key={day.id}
            className={today === day.id ? classes.today : null}
            item
            xs={4}
            sm={2}
          >
            <Day
              day={day}
              inputProps={inputProps}
              onChange={handleDayChange}
              onWheel={handleWheel}
            />
          </Grid>
        ))}
      </Grid>
      <Grid className="previous-pattern" container>
        <Grid item xs={12}>
          <Typography variant="h5">Last week&apos;s pattern</Typography>
          <FormControl>
            <InputLabel id="previous-pattern-label">Previous pattern</InputLabel>
            <Select
              labelId="previous-pattern-label"
              id="previous-pattern"
              value={previousPattern}
              onChange={handlePreviousPatternChange}
            >
              <MenuItem value={-1}>I don&apos;t know</MenuItem>
              <MenuItem value={0}>Fluctuating</MenuItem>
              <MenuItem value={1}>Small Spike</MenuItem>
              <MenuItem value={2}>Large Spike</MenuItem>
              <MenuItem value={3}>Decreasing</MenuItem>
            </Select>
            <FormHelperText>
              Used to calculate % probability of this week&apos;s pattern
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}

PricesForm.propTypes = {
  prices: PropTypes.shape({
    buyPrice: PropTypes.string,
    days: PropTypes.arrayOf(PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    })),
    previousPattern: PropTypes.oneOf([-1, 0, 1, 2, 3]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  today: PropTypes.string.isRequired,
  maxPrice: PropTypes.number.isRequired,
};
