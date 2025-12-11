/**
 * Validate if a number is positive
 */
export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

/**
 * Validate if a number is within a range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate calories input (0-10000 range)
 */
export const isValidCalories = (calories: number): boolean => {
  return isPositiveNumber(calories) && isInRange(calories, 0, 10000);
};

/**
 * Validate macro input (0-1000g range)
 */
export const isValidMacro = (grams: number): boolean => {
  return grams >= 0 && isInRange(grams, 0, 1000);
};

/**
 * Validate water input (0-10L range)
 */
export const isValidWater = (liters: number): boolean => {
  return liters >= 0 && isInRange(liters, 0, 10);
};

/**
 * Validate meal name (1-100 characters)
 */
export const isValidMealName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 100;
};

/**
 * Validate weight input (20-300kg range)
 */
export const isValidWeight = (weight: number): boolean => {
  return isPositiveNumber(weight) && isInRange(weight, 20, 300);
};

/**
 * Validate height input (50-250cm range)
 */
export const isValidHeight = (height: number): boolean => {
  return isPositiveNumber(height) && isInRange(height, 50, 250);
};

/**
 * Validate age input (10-120 years range)
 */
export const isValidAge = (age: number): boolean => {
  return isPositiveNumber(age) && isInRange(age, 10, 120);
};

/**
 * Sanitize string input (trim and limit length)
 */
export const sanitizeString = (
  input: string,
  maxLength: number = 100
): string => {
  return input.trim().slice(0, maxLength);
};

/**
 * Sanitize number input (ensure it's a valid number and within bounds)
 */
export const sanitizeNumber = (
  input: number,
  min: number = 0,
  max: number = Infinity
): number => {
  const num = Number(input);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
};
