// js/calculator/scientific.js
export function scientificEvaluate(expr) {
  try {
    const normalized = expr
      .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
      .replace(/%/g, '/100')
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/asin\(/g, 'Math.asin(')
      .replace(/acos\(/g, 'Math.acos(')
      .replace(/atan\(/g, 'Math.atan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/x²/g, '**2')
      .replace(/x\^y/g, '**')
      .replace(/10\^x/g, '10**')
      .replace(/n!/g, 'factorial(');
    
    if (!normalized.includes('factorial(') && !normalized.includes('Math.')) {
      return null;
    }
    
    // Use Function for scientific only, but restricted to math functions
    const safeFn = new Function('Math', 'factorial', `"use strict"; return (${normalized.replace(/factorial\(/g, 'factorial(')})`);
    return safeFn(Math, factorial);
  } catch (e) {
    return null;
  }
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
