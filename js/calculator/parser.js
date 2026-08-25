// js/calculator/parser.js
export function tokenizer(str) {
  return str.replace(/\s+/g, '').split(/([\+\-\*\/\(\)])/).filter(t => t.length > 0);
}

export function parseExpression(tokens) {
  const outputQueue = [];
  const operatorStack = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  tokens.forEach(token => {
    if (!isNaN(token)) {
      outputQueue.push(parseFloat(token));
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length && operatorStack[operatorStack.length-1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop();
    } else {
      while (operatorStack.length && precedence[operatorStack[operatorStack.length-1]] >= precedence[token]) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    }
  });

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop());
  }

  const stack = [];
  outputQueue.forEach(token => {
    if (typeof token === 'number') {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch(token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
      }
    }
  });

  return stack[0];
}

export function formatResult(num) {
  if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) return 'Error';
  if (Number.isInteger(num)) return num.toLocaleString('en-US');
  return parseFloat(num.toFixed(10)).toLocaleString('en-US', { maximumFractionDigits: 10 });
}
