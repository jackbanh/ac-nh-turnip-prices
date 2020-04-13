import _ from 'underscore';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  AreaSeries,
  ChartLabel,
  Crosshair,
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
} from 'react-vis';

import Typography from '@material-ui/core/Typography';

import createChartData from './createChartData';

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

  const data = useMemo(() => createChartData(predictions), [predictions]);
  const { max, min } = data;

  const handleMouseLeave = useCallback(() => {
    setCrosshairValues([]);
  }, []);

  const handleNearestX = useCallback((value, { index }) => {
    setCrosshairValues([
      data.predictedArea[index],
      data.predictedLine[index],
      data.userLine[index],
    ]);
  }, [data]);

  const convertX = useCallback(x => {
    const i = (x / 2) + 1;
    return {
      day: DAYS_OF_WEEK[Math.floor(i)],
      time: Number.isInteger(i) ? 'am' : 'pm',
    };
  }, []);

  const getNull = useCallback(datum => datum.y != null, []);

  const tickFormat = useCallback(item => {
    if (!Number.isInteger(item)) {
      return null;
    }

    const { day, time } = convertX(item);
    return `${day.substring(0, 3)} ${time}`;
  }, [convertX]);

  const crosshairTitleFormat = useCallback(items => {
    const { x } = items[0];
    const { day, time } = convertX(x);
    return { title: 'Time', value: `${day} ${time}` };
  }, [convertX]);

  const crosshairItemsFormat = useCallback(items => {
    const [predictedArea, predictedLine] = items;

    if (predictedArea.y0 === predictedArea.y) {
      return [{ title: 'Price', value: predictedArea.y }];
    }

    return [
      { title: 'Price range', value: `${predictedArea.y0}–${predictedArea.y}` },
      { title: 'Average predicted price', value: Math.floor(predictedLine.y) },
    ];
  }, []);

  const weeklyBestMaxLabel = useMemo(() => {
    if (max.x < 0) {
      return '';
    }

    const { day, time } = convertX(max.x);
    return `Best high prediction: ${max.y} (${day} ${time})`;
  }, [max]);

  const weeklyBestMinLabel = useMemo(() => {
    if (min.x < 0) {
      return '';
    }

    const { day, time } = convertX(min.x);
    return `Best low prediction: ${min.y} (${day} ${time})`;
  }, [min]);

  return (
    <div className={classes.chart}>
      {_.isEmpty(predictions) && (
        <div className="empty-message">
          <Typography variant="body1">No predictions available for these prices. Only enter buy and sell prices for your island.</Typography>
        </div>
      )}
      {!_.isEmpty(predictions) && (
        <FlexibleWidthXYPlot
          height={250}
          onMouseLeave={handleMouseLeave}
          yDomain={[0, 800]}
        >
          <VerticalGridLines tickTotal={12} />
          <HorizontalGridLines />
          <XAxis tickLabelAngle={-45} tickFormat={tickFormat} />
          <YAxis />
          <AreaSeries
            curve="curveCardinal"
            color={theme.palette.secondary.light}
            data={data.predictedArea}
            opacity={0.5}
          />
          <LineSeries
            curve="curveCardinal"
            color={theme.palette.secondary.dark}
            data={data.predictedLine}
            onNearestX={handleNearestX}
            strokeStyle="dashed"
          />
          <LineSeries
            curve="curveCardinal"
            color={theme.palette.secondary.dark}
            data={data.userLine}
            onNearestX={handleNearestX}
            getNull={getNull}
          />

          <Crosshair
            values={crosshairValues}
            itemsFormat={crosshairItemsFormat}
            titleFormat={crosshairTitleFormat}
          />
          <ChartLabel
            text="thedeadflagblues.com/turnip-predictor"
            includeMargin={false}
            xPercent={0.99}
            yPercent={0.12}
            style={{
              textAnchor: 'end',
            }}
          />
          <ChartLabel
            text={weeklyBestMaxLabel}
            includeMargin={false}
            xPercent={0.008}
            yPercent={0.2}
          />
          <ChartLabel
            text={weeklyBestMinLabel}
            includeMargin={false}
            xPercent={0.008}
            yPercent={0.27}
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
