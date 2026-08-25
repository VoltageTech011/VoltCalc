export async function fetchCurrencyRates(base = 'USD') {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    if (!response.ok) throw new Error('Currency API unavailable');
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.warn('Currency rates unavailable:', error);
    return null;
  }
}

export async function convertCurrency(amount, from, to) {
  const rates = await fetchCurrencyRates(from);
  if (!rates || !rates[to]) return null;
  return amount * rates[to];
}
