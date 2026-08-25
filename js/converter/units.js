// js/converter/units.js
import { conversionCategories } from './conversion.js';

export function getUnitsForCategory(category) {
  return conversionCategories[category] || [];
}

export function convertUnit(category, value, from, to) {
  const units = conversionCategories[category];
  if (!units) return null;
  if (category === 'Temperature') {
    if (from === to) return value;
    if (from === 'Celsius' && to === 'Fahrenheit') return value * 9/5 + 32;
    if (from === 'Fahrenheit' && to === 'Celsius') return (value - 32) * 5/9;
    if (from === 'Celsius' && to === 'Kelvin') return value + 273.15;
    if (from === 'Kelvin' && to === 'Celsius') return value - 273.15;
    if (from === 'Fahrenheit' && to === 'Kelvin') return (value - 32) * 5/9 + 273.15;
    if (from === 'Kelvin' && to === 'Fahrenheit') return (value - 273.15) * 9/5 + 32;
  }
  // Use a base unit approach: convert to base then to target
  const baseValues = {
    'Length': { 'meter': 1, 'kilometer': 1000, 'centimeter': 0.01, 'millimeter': 0.001, 'mile': 1609.34, 'yard': 0.9144, 'foot': 0.3048, 'inch': 0.0254 },
    'Weight': { 'gram': 1, 'kilogram': 1000, 'ton': 1000000, 'pound': 453.592, 'ounce': 28.3495 },
    'Area': { 'square meter': 1, 'square kilometer': 1e6, 'square foot': 0.092903, 'square mile': 2589988.11, 'hectare': 10000 },
    'Volume': { 'liter': 1, 'milliliter': 0.001, 'gallon': 3.78541, 'cubic meter': 1000 },
    'Time': { 'second': 1, 'minute': 60, 'hour': 3600, 'day': 86400, 'week': 604800, 'month': 2629800, 'year': 31557600 },
    'Speed': { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'knot': 0.514444 },
    'Data': { 'byte': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776 }
  };
  const base = baseValues[category];
  if (!base) return null;
  const toBase = base[from];
  const fromBase = base[to];
  if (!toBase || !fromBase) return null;
  return value * toBase / fromBase;
}
