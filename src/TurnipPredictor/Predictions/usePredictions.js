import _ from 'underscore';
import Promise from 'bluebird';
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';

import generatePossibilities from '../js/predictions';

/**
 * Gets the list of predictions.
 * @param {String} buyPrice - Buy price on Sunday.
 * @param {Object[]} days - Array of days and their am/pm sell prices.
 * @returns {Number[]} - List of predicted sell prices.
 */
function getPredictions(buyPriceString, days) {
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

  const iterable = generatePossibilities(sellPrices);
  return Promise.all(iterable);
}

/**
 * Custom hook to calculate the predictions as buy and sell prices are entered.
 * @param {String} buyPrice - Buy price on Sunday.
 * @param {Object[]} days - Array of days and their am/pm sell prices.
 * @returns {Number[]} - List of predicted sell prices.
 */
export default function usePreductions(buyPrice, days) {
  const [predictions, setPredictions] = useState([]);

  const calculatePredictions = useCallback((...args) => {
    getPredictions(...args).then(p => setPredictions(p));
  }, []);

  const debouncedCalculatePredictions = useMemo(
    () => _.debounce(calculatePredictions, 200),
    [calculatePredictions],
  );

  useEffect(() => {
    debouncedCalculatePredictions(buyPrice, days);
  }, [debouncedCalculatePredictions, buyPrice, days]);

  return predictions;
}
