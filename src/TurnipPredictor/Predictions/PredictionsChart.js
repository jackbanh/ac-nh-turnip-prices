import _ from 'underscore';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  AreaSeries,
  Crosshair,
} from 'react-vis';

import Typography from '@material-ui/core/Typography';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function PredictionsChart(props) {
  const theme = useTheme();
  const { classes, predictions } = props;

  const [crosshairValues, setCrosshairValues] = useState([]);

  const data = useMemo(() => {
    const min = [];
    const max = [];
    const mids = [];

    // convert predictions into the expected format, each prediction contains data for all 7 days
    for (let i = 0; i < predictions.length; i += 1) {
      const prediction = predictions[i];

      for (let j = 2; j < prediction.prices.length; j += 1) {
        const price = prediction.prices[j];
        const dataIndex = j - 2;

        if (i === 0) {
          // first prediction so always overwrite
          min[dataIndex] = price.min;
          max[dataIndex] = price.max;
          mids[dataIndex] = [];
        } else {
          min[dataIndex] = Math.min(min[dataIndex], price.min);
          max[dataIndex] = Math.max(max[dataIndex], price.max);
        }

        // mids is an array of all the midpoints
        const difference = price.max - price.min;
        mids[dataIndex].push(price.min + (difference / 2));
      }
    }

    const area = [];
    const line = [];

    for (let i = 0; i < min.length; i += 1) {
      area.push({ x: i, y: max[i], y0: min[i] });

      // calculate the average of all midpoints
      const midsSum = _.reduce(mids[i], (memo, num) => memo + num);
      line.push({ x: i, y: midsSum / mids[i].length });
    }

    return { area, line };
  }, [predictions]);

  const handleMouseLeave = useCallback(() => {
    setCrosshairValues([]);
  }, []);

  const handleNearestX = useCallback((value, { index }) => {
    setCrosshairValues([data.area[index], data.line[index]]);
  }, [data]);

  const convertX = useCallback(x => {
    const i = (x / 2) + 1;
    return {
      day: DAYS_OF_WEEK[Math.floor(i)],
      time: Number.isInteger(i) ? 'am' : 'pm',
    };
  }, []);

  const tickFormat = useCallback(item => {
    const { day, time } = convertX(item);
    return `${day.substring(0, 3)} ${time}`;
  }, [convertX]);

  const crosshairTitleFormat = useCallback(items => {
    const { x } = items[0];
    const { day, time } = convertX(x);
    return { title: 'Time', value: `${day} ${time}` };
  }, [convertX]);

  const crosshairItemsFormat = useCallback(items => {
    const min = items[0].y0;
    const max = items[0].y;

    if (max === min) {
      return [{ title: 'Price', value: min }];
    }

    return [
      { title: 'Price range', value: `${items[0].y0}–${items[0].y}` },
      { title: 'Average predicted price', value: Math.floor(items[1].y) },
    ];
  }, []);

  return (
    <div className={classes.chart}>
      {_.isEmpty(predictions) && (
        <div className="empty-message">
          <Typography variant="body1">No predictions available for these prices.</Typography>
        </div>
      )}
      {!_.isEmpty(predictions) && (
        <FlexibleWidthXYPlot
          height={250}
          onMouseLeave={handleMouseLeave}
          yDomain={[0, 1000]}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickLabelAngle={-45} tickFormat={tickFormat} />
          <YAxis title="Sell price (bells)" />
          <AreaSeries
            curve="curveCardinal"
            color={theme.palette.secondary.light}
            data={data.area}
            opacity={0.5}
          />
          <LineSeries
            curve="curveCardinal"
            color={theme.palette.secondary.dark}
            data={data.line}
            onNearestX={handleNearestX}
            strokeStyle="dashed"
          />
          <Crosshair
            values={crosshairValues}
            itemsFormat={crosshairItemsFormat}
            titleFormat={crosshairTitleFormat}
          />
        </FlexibleWidthXYPlot>
      )}
    </div>
  );
}

PredictionsChart.propTypes = {
  classes: PropTypes.shape({
    chart: PropTypes.string,
  }).isRequired,
  predictions: PropTypes.arrayOf(PropTypes.shape({
    prices: PropTypes.arrayOf(PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    })),
  })),
};

PredictionsChart.defaultProps = {
  predictions: [],
};
