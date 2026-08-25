// js/graph/functions.js
export function evaluateFunction(funcStr, x) {
  try {
    // Sanitize input to only allow math operations
    const sanitized = funcStr
      .replace(/\^/g, '**')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/log\(/g, 'Math.log(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![xp])/g, 'Math.E')
      .replace(/x/g, `(${x})`);
    
    // Use Function constructor with restricted scope
    const evaluator = new Function('Math', `"use strict"; return (${sanitized})`);
    const result = evaluator(Math);
    
    if (typeof result !== 'number' || !isFinite(result)) return NaN;
    return result;
  } catch (e) {
    return NaN;
  }
}

export function validateFunction(funcStr) {
  try {
    const testX = 1;
    const result = evaluateFunction(funcStr, testX);
    return !isNaN(result);
  } catch (e) {
    return false;
  }
}
