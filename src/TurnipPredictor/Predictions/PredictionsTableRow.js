import _ from 'underscore';
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const PatternName = {
  0: 'Fluctuating',
  1: 'Large spike',
  2: 'Decreasing',
  3: 'Small spike',
};

export default function PredictionsTableRow(props) {
  const {
    classes,
    currentPrediction,
    previousPrediction,
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

  const probability = useMemo(() => {
    if (!_.isFinite(currentPrediction.probability)) {
      return '—';
    }

    return `${(currentPrediction.probability * 100).toFixed(2)}%`;
  }, [currentPrediction, previousPrediction]);

  return (
    <TableRow>
      <TableCell className={classes.patternCell}>
        {PatternName[currentPrediction.pattern_number]}
      </TableCell>
      <TableCell>{probability}</TableCell>
      {_.map(currentPrediction.prices, renderPrice)}
    </TableRow>
  );
}

const predictionShape = PropTypes.shape({
  probability: PropTypes.number,
  pattern_number: PropTypes.oneOf([0, 1, 2, 3]),
  prices: PropTypes.arrayOf(PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  })),
});

PredictionsTableRow.propTypes = {
  classes: PropTypes.shape({
    patternCell: PropTypes.string,
  }).isRequired,
  currentPrediction: predictionShape.isRequired,
  previousPrediction: predictionShape,
};

PredictionsTableRow.defaultProps = {
  previousPrediction: null,
};
