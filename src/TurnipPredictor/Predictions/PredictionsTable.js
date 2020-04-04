import _ from 'underscore';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function PredictionsTable(props) {
  const {
    classes,
    days,
    predictions,
    today,
  } = props;

  const renderPrice = useCallback((price, i) => {
    if (i < 2) {
      // buy price, don't render
      return null;
    }

    return (
      <TableCell key={i}>
        {price.min === price.max ? `${price.min}` : `${price.min}–${price.max}`}
      </TableCell>
    );
  }, []);

  if (_.isEmpty(predictions)) {
    return null;
  }

  return (
    <TableContainer>
      <Table size="small" padding="none">
        <colgroup>
          <col />
          {_.map(days, day => (
            <React.Fragment key={day.id}>
              <col />
              <col className={classes.striped} />
            </React.Fragment>
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell padding="default">Pattern</TableCell>
            {_.map(days, day => (
              <TableCell
                key={day.id}
                colSpan={2}
                className={day.id === today ? classes.today : null}
                padding="default"
              >
                {day.id}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell />
            {_.map(days, day => (
              <React.Fragment key={day.id}>
                <TableCell>am</TableCell>
                <TableCell>pm</TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {_.map(predictions, (p, i) => (
            <TableRow key={i}>
              <TableCell className={classes.patternCell}>{p.pattern_description}</TableCell>
              {_.map(p.prices, renderPrice)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

PredictionsTable.propTypes = {
  classes: PropTypes.shape({
    patternCell: PropTypes.string,
    striped: PropTypes.string,
    today: PropTypes.string,
  }).isRequired,
  days: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })),
  predictions: PropTypes.arrayOf(PropTypes.shape({
    prices: PropTypes.arrayOf(PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    })),
  })),
  today: PropTypes.string.isRequired,
};

PredictionsTable.defaultProps = {
  days: [],
  predictions: [],
};
