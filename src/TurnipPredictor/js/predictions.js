const PATTERN = {
  FLUCTUATING: 0,
  LARGE_SPIKE: 1,
  DECREASING: 2,
  SMALL_SPIKE: 3,
};

const PATTERN_COUNTS = {
  [PATTERN.FLUCTUATING]: 56,
  [PATTERN.LARGE_SPIKE]: 7,
  [PATTERN.DECREASING]: 1,
  [PATTERN.SMALL_SPIKE]: 8,
};

const PROBABILITY_MATRIX = {
  [PATTERN.FLUCTUATING]: {
    [PATTERN.FLUCTUATING]: 0.20,
    [PATTERN.LARGE_SPIKE]: 0.30,
    [PATTERN.DECREASING]: 0.15,
    [PATTERN.SMALL_SPIKE]: 0.35,
  },
  [PATTERN.LARGE_SPIKE]: {
    [PATTERN.FLUCTUATING]: 0.50,
    [PATTERN.LARGE_SPIKE]: 0.05,
    [PATTERN.DECREASING]: 0.20,
    [PATTERN.SMALL_SPIKE]: 0.25,
  },
  [PATTERN.DECREASING]: {
    [PATTERN.FLUCTUATING]: 0.25,
    [PATTERN.LARGE_SPIKE]: 0.45,
    [PATTERN.DECREASING]: 0.05,
    [PATTERN.SMALL_SPIKE]: 0.25,
  },
  [PATTERN.SMALL_SPIKE]: {
    [PATTERN.FLUCTUATING]: 0.45,
    [PATTERN.LARGE_SPIKE]: 0.25,
    [PATTERN.DECREASING]: 0.15,
    [PATTERN.SMALL_SPIKE]: 0.15,
  },
};

function minimum_rate_from_given_and_base(given_price, buy_price) {
  return 10000 * (given_price - 1) / buy_price;
}

function maximum_rate_from_given_and_base(given_price, buy_price) {
  return 10000 * given_price / buy_price;
}

function* generate_pattern_0_with_lengths(given_prices, high_phase_1_len, dec_phase_1_len, high_phase_2_len, dec_phase_2_len, high_phase_3_len) {
    /*
      // PATTERN 0: high, decreasing, high, decreasing, high
      work = 2;
      // high phase 1
      for (int i = 0; i < hiPhaseLen1; i++)
      {
        sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
      }
      // decreasing phase 1
      rate = randfloat(0.8, 0.6);
      for (int i = 0; i < decPhaseLen1; i++)
      {
        sellPrices[work++] = intceil(rate * basePrice);
        rate -= 0.04;
        rate -= randfloat(0, 0.06);
      }
      // high phase 2
      for (int i = 0; i < (hiPhaseLen2and3 - hiPhaseLen3); i++)
      {
        sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
      }
      // decreasing phase 2
      rate = randfloat(0.8, 0.6);
      for (int i = 0; i < decPhaseLen2; i++)
      {
        sellPrices[work++] = intceil(rate * basePrice);
        rate -= 0.04;
        rate -= randfloat(0, 0.06);
      }
      // high phase 3
      for (int i = 0; i < hiPhaseLen3; i++)
      {
        sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
      }
  */

  const buy_price = given_prices[0];
  const predicted_prices = [
    {
      min: buy_price,
      max: buy_price,
    },
    {
      min: buy_price,
      max: buy_price,
    },
  ];

  // High Phase 1
  for (let i = 2; i < 2 + high_phase_1_len; i++) {
    let min_pred = Math.floor(0.9 * buy_price);
    let max_pred = Math.ceil(1.4 * buy_price);
    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });
  }

  // Dec Phase 1
  let min_rate = 6000;
  let max_rate = 8000;
  for (let i = 2 + high_phase_1_len; i < 2 + high_phase_1_len + dec_phase_1_len; i++) {
    let min_pred = Math.floor(min_rate * buy_price / 10000);
    let max_pred = Math.ceil(max_rate * buy_price / 10000);


    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
      min_rate = minimum_rate_from_given_and_base(given_prices[i], buy_price);
      max_rate = maximum_rate_from_given_and_base(given_prices[i], buy_price);
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });

    min_rate -= 1000;
    max_rate -= 400;
  }

  // High Phase 2
  for (let i = 2 + high_phase_1_len + dec_phase_1_len; i < 2 + high_phase_1_len + dec_phase_1_len + high_phase_2_len; i++) {
    let min_pred = Math.floor(0.9 * buy_price);
    let max_pred = Math.ceil(1.4 * buy_price);
    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });
  }

  // Dec Phase 2
  min_rate = 6000;
  max_rate = 8000;
  for (let i = 2 + high_phase_1_len + dec_phase_1_len + high_phase_2_len; i < 2 + high_phase_1_len + dec_phase_1_len + high_phase_2_len + dec_phase_2_len; i++) {
    let min_pred = Math.floor(min_rate * buy_price / 10000);
    let max_pred = Math.ceil(max_rate * buy_price / 10000);


    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
      min_rate = minimum_rate_from_given_and_base(given_prices[i], buy_price);
      max_rate = maximum_rate_from_given_and_base(given_prices[i], buy_price);
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });

    min_rate -= 1000;
    max_rate -= 400;
  }

  // High Phase 3
  if (2 + high_phase_1_len + dec_phase_1_len + high_phase_2_len + dec_phase_2_len + high_phase_3_len !== 14) {
    throw new Error("Phase lengths don't add up");
  }
  for (let i = 2 + high_phase_1_len + dec_phase_1_len + high_phase_2_len + dec_phase_2_len; i < 14; i++) {
    let min_pred = Math.floor(0.9 * buy_price);
    let max_pred = Math.ceil(1.4 * buy_price);
    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });
  }
  yield {
    pattern_description: "Fluctuating",
    pattern_number: 0,
    prices: predicted_prices
  };
}

function* generate_pattern_0(given_prices) {
  /*
      decPhaseLen1 = randbool() ? 3 : 2;
      decPhaseLen2 = 5 - decPhaseLen1;
      hiPhaseLen1 = randint(0, 6);
      hiPhaseLen2and3 = 7 - hiPhaseLen1;
      hiPhaseLen3 = randint(0, hiPhaseLen2and3 - 1);
  */
  for (let dec_phase_1_len = 2; dec_phase_1_len < 4; dec_phase_1_len++) {
    for (let high_phase_1_len = 0; high_phase_1_len < 7; high_phase_1_len++) {
      for (let high_phase_3_len = 0; high_phase_3_len < (7 - high_phase_1_len - 1 + 1); high_phase_3_len++) {
        yield* generate_pattern_0_with_lengths(given_prices, high_phase_1_len, dec_phase_1_len, 7 - high_phase_1_len - high_phase_3_len, 5 - dec_phase_1_len, high_phase_3_len);
      }
    }
  }
}

function* generate_pattern_1_with_peak(given_prices, peak_start) {
  /*
    // PATTERN 1: decreasing middle, high spike, random low
    peakStart = randint(3, 9);
    rate = randfloat(0.9, 0.85);
    for (work = 2; work < peakStart; work++)
    {
      sellPrices[work] = intceil(rate * basePrice);
      rate -= 0.03;
      rate -= randfloat(0, 0.02);
    }
    sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    sellPrices[work++] = intceil(randfloat(1.4, 2.0) * basePrice);
    sellPrices[work++] = intceil(randfloat(2.0, 6.0) * basePrice);
    sellPrices[work++] = intceil(randfloat(1.4, 2.0) * basePrice);
    sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    for (; work < 14; work++)
    {
      sellPrices[work] = intceil(randfloat(0.4, 0.9) * basePrice);
    }
  */

  const buy_price = given_prices[0];
  const predicted_prices = [
    {
      min: buy_price,
      max: buy_price,
    },
    {
      min: buy_price,
      max: buy_price,
    },
  ];

  let min_rate = 8500;
  let max_rate = 9000;

  for (let i = 2; i < peak_start; i++) {
    let min_pred = Math.floor(min_rate * buy_price / 10000);
    let max_pred = Math.ceil(max_rate * buy_price / 10000);


    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
      min_rate = minimum_rate_from_given_and_base(given_prices[i], buy_price);
      max_rate = maximum_rate_from_given_and_base(given_prices[i], buy_price);
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });

    min_rate -= 500;
    max_rate -= 300;
  }

  // Now each day is independent of next
  const min_randoms = [0.9, 1.4, 2.0, 1.4, 0.9, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4];
  const max_randoms = [1.4, 2.0, 6.0, 2.0, 1.4, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9];
  for (let i = peak_start; i < 14; i++) {
    let min_pred = Math.floor(min_randoms[i - peak_start] * buy_price);
    let max_pred = Math.ceil(max_randoms[i - peak_start] * buy_price);

    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });
  }
  yield {
    pattern_description: "Large spike",
    pattern_number: 1,
    prices: predicted_prices
  };
}

function* generate_pattern_1(given_prices) {
  for (let peak_start = 3; peak_start < 10; peak_start++) {
    yield* generate_pattern_1_with_peak(given_prices, peak_start);
  }
}

function* generate_pattern_2(given_prices) {
  /*
      // PATTERN 2: consistently decreasing
      rate = 0.9;
      rate -= randfloat(0, 0.05);
      for (work = 2; work < 14; work++)
      {
        sellPrices[work] = intceil(rate * basePrice);
        rate -= 0.03;
        rate -= randfloat(0, 0.02);
      }
      break;
  */


  const buy_price = given_prices[0];
  const predicted_prices = [
    {
      min: buy_price,
      max: buy_price,
    },
    {
      min: buy_price,
      max: buy_price,
    },
  ];

  let min_rate = 8500;
  let max_rate = 9000;
  for (let i = 2; i < 14; i++) {
    let min_pred = Math.floor(min_rate * buy_price / 10000);
    let max_pred = Math.ceil(max_rate * buy_price / 10000);


    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
      min_rate = minimum_rate_from_given_and_base(given_prices[i], buy_price);
      max_rate = maximum_rate_from_given_and_base(given_prices[i], buy_price);
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });

    min_rate -= 500;
    max_rate -= 300;
  }
  yield {
    pattern_description: "Decreasing",
    pattern_number: 2,
    prices: predicted_prices
  };
}

function* generate_pattern_3_with_peak(given_prices, peak_start) {

  /*
    // PATTERN 3: decreasing, spike, decreasing
    peakStart = randint(2, 9);
    // decreasing phase before the peak
    rate = randfloat(0.9, 0.4);
    for (work = 2; work < peakStart; work++)
    {
      sellPrices[work] = intceil(rate * basePrice);
      rate -= 0.03;
      rate -= randfloat(0, 0.02);
    }
    sellPrices[work++] = intceil(randfloat(0.9, 1.4) * (float)basePrice);
    sellPrices[work++] = intceil(randfloat(0.9, 1.4) * basePrice);
    rate = randfloat(1.4, 2.0);
    sellPrices[work++] = intceil(randfloat(1.4, rate) * basePrice) - 1;
    sellPrices[work++] = intceil(rate * basePrice);
    sellPrices[work++] = intceil(randfloat(1.4, rate) * basePrice) - 1;
    // decreasing phase after the peak
    if (work < 14)
    {
      rate = randfloat(0.9, 0.4);
      for (; work < 14; work++)
      {
        sellPrices[work] = intceil(rate * basePrice);
        rate -= 0.03;
        rate -= randfloat(0, 0.02);
      }
    }
  */

  const buy_price = given_prices[0];
  const predicted_prices = [
    {
      min: buy_price,
      max: buy_price,
    },
    {
      min: buy_price,
      max: buy_price,
    },
  ];

  let min_rate = 4000;
  let max_rate = 9000;

  for (let i = 2; i < peak_start; i++) {
    let min_pred = Math.floor(min_rate * buy_price / 10000);
    let max_pred = Math.ceil(max_rate * buy_price / 10000);


    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
      min_rate = minimum_rate_from_given_and_base(given_prices[i], buy_price);
      max_rate = maximum_rate_from_given_and_base(given_prices[i], buy_price);
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });

    min_rate -= 500;
    max_rate -= 300;
  }

  // The peak

  for (let i = peak_start; i < peak_start + 2; i++) {
    let min_pred = Math.floor(0.9 * buy_price);
    let max_pred = Math.ceil(1.4 * buy_price);
    if (!isNaN(given_prices[i])) {
      if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
        // Given price is out of predicted range, so this is the wrong pattern
        return;
      }
      min_pred = given_prices[i];
      max_pred = given_prices[i];
    }

    predicted_prices.push({
      min: min_pred,
      max: max_pred,
    });
  }

  // Main spike 1
  let min_pred = Math.floor(1.4 * buy_price) - 1;
  let max_pred = Math.ceil(2.0 * buy_price) - 1;
  if (!isNaN(given_prices[peak_start + 2])) {
    if (given_prices[peak_start + 2] < min_pred || given_prices[peak_start + 2] > max_pred) {
      // Given price is out of predicted range, so this is the wrong pattern
      return;
    }
    min_pred = given_prices[peak_start + 2];
    max_pred = given_prices[peak_start + 2];
  }
  predicted_prices.push({
    min: min_pred,
    max: max_pred,
  });

  // Main spike 2
  min_pred = predicted_prices[peak_start + 2].min;
  max_pred = Math.ceil(2.0 * buy_price);
  if (!isNaN(given_prices[peak_start + 3])) {
    if (given_prices[peak_start + 3] < min_pred || given_prices[peak_start + 3] > max_pred) {
      // Given price is out of predicted range, so this is the wrong pattern
      return;
    }
    min_pred = given_prices[peak_start + 3];
    max_pred = given_prices[peak_start + 3];
  }
  predicted_prices.push({
    min: min_pred,
    max: max_pred,
  });

  // Main spike 3
  min_pred = Math.floor(1.4 * buy_price) - 1;
  max_pred = predicted_prices[peak_start + 3].max - 1;
  if (!isNaN(given_prices[peak_start + 4])) {
    if (given_prices[peak_start + 4] < min_pred || given_prices[peak_start + 4] > max_pred) {
      // Given price is out of predicted range, so this is the wrong pattern
      return;
    }
    min_pred = given_prices[peak_start + 4];
    max_pred = given_prices[peak_start + 4];
  }
  predicted_prices.push({
    min: min_pred,
    max: max_pred,
  });

  if (peak_start + 5 < 14) {
    min_rate = 4000;
    max_rate = 9000;

    for (let i = peak_start + 5; i < 14; i++) {
      min_pred = Math.floor(min_rate * buy_price / 10000);
      max_pred = Math.ceil(max_rate * buy_price / 10000);


      if (!isNaN(given_prices[i])) {
        if (given_prices[i] < min_pred || given_prices[i] > max_pred) {
          // Given price is out of predicted range, so this is the wrong pattern
          return;
        }
        min_pred = given_prices[i];
        max_pred = given_prices[i];
        min_rate = minimum_rate_from_given_and_base(given_prices[i], buy_price);
        max_rate = maximum_rate_from_given_and_base(given_prices[i], buy_price);
      }

      predicted_prices.push({
        min: min_pred,
        max: max_pred,
      });

      min_rate -= 500;
      max_rate -= 300;
    }
  }

  yield {
    pattern_description: "Small spike",
    pattern_number: 3,
    prices: predicted_prices
  };
}

function* generate_pattern_3(given_prices) {
  for (let peak_start = 2; peak_start < 10; peak_start++) {
    yield* generate_pattern_3_with_peak(given_prices, peak_start);
  }
}

function* generate_possibilities(sell_prices, first_buy) {
  if (first_buy || isNaN(sell_prices[0])) {
    for (let buy_price = 90; buy_price <= 110; buy_price++) {
      sell_prices[0] = sell_prices[1] = buy_price;
      if (first_buy) {
        yield* generate_pattern_3(sell_prices);
      } else {
        yield* generate_pattern_0(sell_prices);
        yield* generate_pattern_1(sell_prices);
        yield* generate_pattern_2(sell_prices);
        yield* generate_pattern_3(sell_prices);
      }
    }
  } else {
    yield* generate_pattern_0(sell_prices);
    yield* generate_pattern_1(sell_prices);
    yield* generate_pattern_2(sell_prices);
    yield* generate_pattern_3(sell_prices);
  }
}

function row_probability(possibility, previous_pattern) {
  return PROBABILITY_MATRIX[previous_pattern][possibility.pattern_number] / PATTERN_COUNTS[possibility.pattern_number];
}

function get_probabilities(possibilities, previous_pattern) {
  if (typeof previous_pattern === 'undefined' || Number.isNaN(previous_pattern) || previous_pattern === null || previous_pattern < 0 || previous_pattern > 3) {
    return possibilities;
  }

  const max_percent = possibilities.map(function (poss) {
    return row_probability(poss, previous_pattern);
  }).reduce(function (prev, current) {
    return prev + current;
  }, 0);

  return possibilities.map(function (poss) {
    poss.probability = row_probability(poss, previous_pattern) / max_percent;
    return poss;
  });
}

function analyze_possibilities(sell_prices, first_buy, previous_pattern) {
  let generated_possibilities = Array.from(generate_possibilities(sell_prices, first_buy));
  generated_possibilities = get_probabilities(generated_possibilities, previous_pattern);

  const global_min_max = [];
  for (let day = 0; day < 14; day++) {
    const prices = {
      min: 999,
      max: 0,
    };
    for (const poss of generated_possibilities) {
      if (poss.prices[day].min < prices.min) {
        prices.min = poss.prices[day].min;
      }
      if (poss.prices[day].max > prices.max) {
        prices.max = poss.prices[day].max;
      }
    }
    global_min_max.push(prices);
  }

  generated_possibilities.push({
    pattern_description: "All patterns",
    pattern_number: 4,
    prices: global_min_max,
  });

  for (const poss of generated_possibilities) {
    const weekMins = [];
    const weekMaxes = [];
    for (const day of poss.prices.slice(1)) {
      weekMins.push(day.min);
      weekMaxes.push(day.max);
    }
    poss.weekGuaranteedMinimum = Math.max(...weekMins);
    poss.weekMax = Math.max(...weekMaxes);
  }

  generated_possibilities.sort((a, b) => {
    if (a.weekMax < b.weekMax) {
      return 1;
    }
    if (a.weekMax > b.weekMax) {
      return -1;
    }
    return 0;
  });

  return generated_possibilities;
}

export const generatePossibilities = generate_possibilities;
export const getProbabilities = get_probabilities;