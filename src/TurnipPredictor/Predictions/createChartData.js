import _ from 'underscore';

class ChartDatum {
  constructor(x) {
    this.x = x;
    this.min = null;
    this.max = null;
    this.mids = [];
  }

  addPrice(price) {
    // update min and max
    if (this.min == null) {
      this.min = price.min;
      this.max = price.max;
    } else {
      this.min = Math.min(this.min, price.min);
      this.max = Math.max(this.max, price.max);
    }

    // add to list of midpoints
    const difference = price.max - price.min;
    this.mids.push(price.min + (difference / 2));
  }

  getMidsAverage() {
    const sum = _.reduce(this.mids, (memo, num) => memo + num, 0);
    return sum / this.mids.length;
  }

  getIsPrediction() {
    return this.min < this.max;
  }

  get y() { return this.max; }

  get y0() { return this.min; }
}

export default function createChartData(predictions) {
  const predictedArea = [];

  // convert predictions into the expected format, each prediction contains data for all 7 days
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];

    // for each price in the prediction (skipping the initial predicted buy price)
    for (let j = 2; j < prediction.prices.length; j += 1) {
      const price = prediction.prices[j];
      const dataIndex = j - 2;

      if (predictedArea[dataIndex] == null) {
        // first prediction, so predictedArea[dataIndex] needs to be initialized
        predictedArea[dataIndex] = new ChartDatum(dataIndex);
      }

      predictedArea[dataIndex].addPrice(price);
    }
  }

  const yDomain = [0, 100];
  const predictedLine = [];
  const userLine = [];
  let weeklyBestMax = { x: -1, y: 0 };
  let weeklyBestMin = { x: -1, y: 0 };

  for (let i = 0; i < predictedArea.length; i += 1) {
    const datum = predictedArea[i];

    // calculate the average of all midpoints, that is the predicted (dashed) line
    predictedLine.push({ x: i, y: datum.getMidsAverage() });

    const isPrediction = datum.getIsPrediction();

    // calculate the solid line of user-entered data
    // line will only start at x=0 and continue for contiguous data
    if (!isPrediction && (i === 0 || userLine[i - 1].y != null)) {
      userLine.push({ x: i, y: datum.max });
    } else {
      userLine.push({ x: i, y: null });
    }

    if (isPrediction) {
      // calculate best max for the entire week
      if (datum.max >= weeklyBestMax.y) {
        weeklyBestMax = { x: i, y: datum.max };
      }

      // calculate best min for the entire week
      if (datum.min >= weeklyBestMin.y) {
        weeklyBestMin = { x: i, y: datum.min };
      }
    }

    // update bounds of y-axis
    yDomain[1] = Math.max(yDomain[1], datum.max * 1.1);
  }

  return {
    predictedArea,
    predictedLine,
    userLine,
    max: weeklyBestMax,
    min: weeklyBestMin,
    yDomain,
  };
}
