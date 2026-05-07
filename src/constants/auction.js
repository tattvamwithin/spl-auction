export const CATEGORIES = {
  ELITE: 'Elite',
  FORTY_PLUS: '40+',
  UNDER_21: 'Under 21',
  WARRIOR: 'Warrior',
};

export const BASE_PRICES = {
  [CATEGORIES.ELITE]: 500, // 5 Cr in Lakhs (500 Lakhs = 5 Cr)
  [CATEGORIES.FORTY_PLUS]: 200, // 2 Cr
  [CATEGORIES.UNDER_21]: 100, // 1 Cr
  [CATEGORIES.WARRIOR]: 200, // 2 Cr
};

export const ROLES = {
  BATSMAN: 'Batsman',
  BOWLER: 'Bowler',
  ALL_ROUNDER: 'All Rounder',
  WICKET_KEEPER: 'Wicket Keeper',
};

export const TEAMS_INITIAL_BUDGET = 10000; // 100 Cr in Lakhs (10000 Lakhs = 100 Cr)

export const BID_INCREMENTS = [50, 100]; // 0.5 Cr and 1 Cr
