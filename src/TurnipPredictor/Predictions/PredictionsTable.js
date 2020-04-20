import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import PredictionsTableRow from './PredictionsTableRow';

export default function PredictionsTable(props) {
  const {
    classes,
    days,
    predictions,
    today,
  } = props;

  if (_.isEmpty(predictions)) {
    return null;
  }

  return (
    <TableContainer>
      <Table size="small" padding="none">
        <colgroup>
          <col />
          <col className={classes.striped} />
          {_.map(days, day => (
            <React.Fragment key={day.id}>
              <col />
              <col className={classes.striped} />
            </React.Fragment>
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Pattern</TableCell>
            <TableCell>Chance</TableCell>
            {_.map(days, day => (
              <TableCell
                key={day.id}
                colSpan={2}
                className={day.id === today ? classes.today : null}
              >
                {day.id}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell />
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
            <PredictionsTableRow
              key={i}
              classes={classes}
              currentPrediction={p}
              previousPrediction={i > 0 ? predictions[i - 1] : null}
            />
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
