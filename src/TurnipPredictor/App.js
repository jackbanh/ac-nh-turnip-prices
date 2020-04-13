import _ from 'underscore';
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';

import useStyles from './useStyles';
import PricesForm from './PricesForm/PricesForm';
import usePredictions from './Predictions/usePredictions';
import PredictionsChart from './Predictions/PredictionsChart';
import PredictionsTable from './Predictions/PredictionsTable';
import CreditsDialog from './CreditsDialog';

const LOCAL_STORAGE_KEY = 'TurnipPredictor';
const DEFAULT_VALUE = {
  lastUpdated: null,
  buyPrice: '',
  days: [
    { id: 'Monday', am: '', pm: '' },
    { id: 'Tuesday', am: '', pm: '' },
    { id: 'Wednesday', am: '', pm: '' },
    { id: 'Thursday', am: '', pm: '' },
    { id: 'Friday', am: '', pm: '' },
    { id: 'Saturday', am: '', pm: '' },
  ],
  previousPattern: -1,
};

const MAX_PRICE = 800;

export default function App() {
  const classes = useStyles();

  const [prices, setPrices] = useState({});
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  const { buyPrice, days, previousPattern } = prices;
  const predictions = usePredictions(buyPrice, days, previousPattern);

  const today = useMemo(() => {
    const now = new Date();
    const day = now.getDay();

    if (day === 0) {
      return 'Sunday';
    }

    return DEFAULT_VALUE.days[day - 1].id;
  }, []);

  useEffect(() => {
    if (_.isEmpty(prices)) {
      // load settings from storage
      const str = localStorage.getItem(LOCAL_STORAGE_KEY);

      try {
        const loadedPrices = _.defaults(JSON.parse(str), DEFAULT_VALUE);
        setPrices(loadedPrices);
      } catch {
        setPrices(DEFAULT_VALUE);
      }
    } else {
      // write settings to storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prices));
    }
  }, [prices]);

  const handlePricesChange = useCallback(delta => {
    setPrices({
      ...prices,
      ...delta,
      lastUpdated: Date.now(),
    });
  }, [prices]);

  const handleClearAllClick = useCallback(() => {
    setPrices(DEFAULT_VALUE);
  }, []);

  const lastUpdated = useMemo(() => {
    if (!prices.lastUpdated) {
      return null;
    }

    const d = new Date(prices.lastUpdated);

    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const hour = `${d.getHours()}`.padStart(2, '0');
    const minute = `${d.getMinutes()}`.padStart(2, '0');

    return `${d.getFullYear()}-${month}-${day} ${hour}:${minute}`;
  }, [prices.lastUpdated]);

  const handleCreditsOpen = useCallback(() => setIsCreditsOpen(true), []);
  const handleCreditsClose = useCallback(() => setIsCreditsOpen(false), []);

  return (
    <Container>
      <Paper className={classes.paper}>
        <Container className={classes.container}>
          <Typography className={classes.heading} variant="h5">Turnip Predictor</Typography>
          <Typography variant="h6" gutterBottom>For Animal Crossing: New Horizons&mdash;Based on <Link href="https://turnipprophet.io/">turnipprophet.io</Link></Typography>

          <PredictionsChart
            classes={classes}
            days={days}
            predictions={predictions}
          />

          <PricesForm
            prices={prices}
            onChange={handlePricesChange}
            today={today}
            maxPrice={MAX_PRICE}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Button
                className={classes.button}
                variant="contained"
                onClick={handleCreditsOpen}
              >
                About
              </Button>

              <Button
                className={classes.button}
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={handleClearAllClick}
                color="secondary"
              >
                Reset
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              {lastUpdated && (
                <Typography className={classes.saveMessage} variant="body2" align="right">
                  {`Saved: ${lastUpdated}`}
                </Typography>
              )}
            </Grid>
          </Grid>

        </Container>
      </Paper>

      <Paper className={classes.predictionsTable}>
        <PredictionsTable
          classes={classes}
          predictions={predictions}
          today={today}
          days={days}
        />
      </Paper>

      <CreditsDialog open={isCreditsOpen} onClose={handleCreditsClose} />
    </Container>
  );
}
