import _ from 'underscore';

export default function createChartData(predictions) {
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

  const predictedArea = [];
  const predictedLine = [];
  const userLine = [];
  let weeklyBestMax = { x: -1, y: 0 };
  let weeklyBestMin = { x: -1, y: 0 };

  for (let i = 0; i < min.length; i += 1) {
    predictedArea.push({ x: i, y: max[i], y0: min[i] });

    // calculate the average of all midpoints
    const midsSum = _.reduce(mids[i], (memo, num) => memo + num);
    predictedLine.push({ x: i, y: midsSum / mids[i].length });

    const isPrediction = max[i] > min[i];

    // calculate the solid line of user-entered data
    // line will only start at x=0 and continue for contiguous data
    if (!isPrediction && (i === 0 || userLine[i - 1].y != null)) {
      userLine.push({ x: i, y: min[i] });
    } else {
      userLine.push({ x: i, y: null });
    }

    if (isPrediction) {
      // calculate best max for the entire week
      if (max[i] >= weeklyBestMax.y) {
        weeklyBestMax = { x: i, y: max[i] };
      }

      // calculate best min for the entire week
      if (min[i] >= weeklyBestMin.y) {
        weeklyBestMin = { x: i, y: min[i] };
      }
    }
  }

  return {
    predictedArea,
    predictedLine,
    userLine,
    max: weeklyBestMax,
    min: weeklyBestMin,
  };
}
