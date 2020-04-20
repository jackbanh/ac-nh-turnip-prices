/* global describe, it, expect */

import _ from 'underscore';
import Promise from 'bluebird';
import { generatePossibilities } from './predictions';

describe('predictions.js', () => {
  describe('generate_possibilities', () => {
    it('should generate possibilities with buy and sell prices', async () => {
      expect(generatePossibilities).toBeInstanceOf(Function);

      const sellPrices = [100, 100, 100, 100];
      const iterable = generatePossibilities(sellPrices, false, -1);

      const predictions = await Promise.all(iterable);

      expect(predictions).toBeInstanceOf(Array);
      expect(predictions.length).toBeGreaterThan(0);

      for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];

        // verify structure of prediction
        const {
          pattern_description,
          pattern_number,
          prices,
          probability,
        } = prediction;
        expect(_.isString(pattern_description)).toEqual(true);
        expect(pattern_number >= 0 && pattern_number < 4).toEqual(true);
        expect(probability > 0 && probability <= 1).toEqual(true);
        expect(prices.length).toEqual(14);

        // verify structure of prediction.price
        expect(_.isFinite(prices[0].min)).toEqual(true);
        expect(_.isFinite(prices[0].max)).toEqual(true);
      }
    });
  });
});
