import _ from 'underscore';
import Promise from 'bluebird';
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';

import { generatePossibilities } from '../js/predictions';

/**
 * Gets the list of predictions.
 * @param {String} buyPrice - Buy price on Sunday.
 * @param {Object[]} days - Array of days and their am/pm sell prices.
* @param {Number} [previousPattern] - Last week's pattern, if known.
 * @returns {Number[]} - List of predicted sell prices.
 */
function getPredictions(buyPriceString, days, previousPattern) {
  // convert to format required by generate_possibilities
  const buyPrice = parseInt(buyPriceString, 10);
  const sellPrices = [buyPrice, buyPrice];
  _.each(days, day => {
    sellPrices.push(parseInt(day.am, 10));
    sellPrices.push(parseInt(day.pm, 10));
  });

  const ret = [];

  if (_.every(sellPrices, _.isNaN)) {
    // no input, don't generate possibilities
    return Promise.resolve(ret);
  }

  const iterable = generatePossibilities(sellPrices, false, previousPattern);
  return Promise.all(iterable);
}

/**
 * Custom hook to calculate the predictions as buy and sell prices are entered.
 * @param {String} buyPrice - Buy price on Sunday.
 * @param {Object[]} days - Array of days and their am/pm sell prices.
 * @param {Number} [previousPattern] - Last week's pattern, if known.
 * @returns {Number[]} - List of predicted sell prices.
 */
export default function usePreductions(buyPrice, days, previousPattern) {
  const [predictions, setPredictions] = useState([]);

  const calculatePredictions = useCallback((...args) => {
    getPredictions(...args)
      .then(p => {
        // convert the weights into actual percentage probability
        const totalWeight = _.reduce(p, (memo, prediction) => memo + prediction.probability, 0);
        for (let i = 0; i < p.length; i += 1) {
          const prediction = p[i];
          prediction.probability /= totalWeight;
        }
        return p;
      }).then(p => {
        // sort probabitilities in ascending order
        p.sort((a, b) => {
          if (a.probability > b.probability) {
            return -1;
          }
          if (a.probability === b.probability) {
            return 0;
          }
          return 1;
        });
        return p;
      }).then(p => {
        setPredictions(p);
        return p;
      });
  }, []);

  const debouncedCalculatePredictions = useMemo(
    () => _.debounce(calculatePredictions, 200),
    [calculatePredictions],
  );

  useEffect(() => {
    debouncedCalculatePredictions(buyPrice, days, previousPattern);
  }, [debouncedCalculatePredictions, buyPrice, days, previousPattern]);

  return predictions;
}
