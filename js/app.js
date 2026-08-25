// js/app.js
import { tokenizer, parseExpression, formatResult } from './calculator/parser.js';
import { scientificEvaluate } from './calculator/scientific.js';
import { memory } from './calculator/memory.js';
import { historyManager } from './history/manager.js';
import { historySearch } from './history/search.js';
import { exportHistory } from './history/export.js';
import { importHistory } from './history/import.js';
import { getUnitsForCategory, convertUnit } from './converter/units.js';
import { conversionCategories } from './converter/conversion.js';
import { renderGraph, resetGraphView, zoomIn, zoomOut } from './graph/renderer.js';
import { evaluateFunction, validateFunction } from './graph/functions.js';
import { getViewState, setViewState, resetView, zoomIn as controlZoomIn, zoomOut as controlZoomOut, panLeft, panRight, panUp, panDown } from './graph/controls.js';
import { formulaLibrary } from './formulas/mathematics.js';
import { physicsFormulas } from './formulas/physics.js';
import { geometryFormulas } from './formulas/geometry.js';
import { storage } from './storage/storage.js';
import { loadTheme, toggleTheme } from './ui/theme.js';
import { showToast } from './ui/toast.js';
import { showModal } from './ui/modal.js';
import { announceMessage, setupKeyboardNavigation, setReducedMotion } from './ui/accessibility.js';
import { navigateTo } from './ui/navigation.js';
import { fetchCurrencyRates, convertCurrency } from './api/currency.js';

// Application state
let currentExpression = '';
let currentResult = '0';
let currentMode = 'standard';
let activeSection = 'calculator';
let scientificMode = false;
let angleMode = 'deg';
let graphViewState = getViewState();

// DOM refs
const expressionDisplay = document.getElementById('expressionDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const copyBtn = document.getElementById('copyResultBtn');
const calcModeIndicator = document.getElementById('calcModeIndicator');
const memoryValueSpan = document.getElementById('memoryValue');
const rightMemoryValue = document.getElementById('rightMemoryValue');
const rightThemeValue = document.getElementById('rightThemeValue');
const rightOfflineValue = document.getElementById('rightOfflineValue');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const calcKeypad = document.getElementById('calcKeypad');
const modeButtons = document.querySelectorAll('.mode-btn');
const categorySelect = document.getElementById('categorySelect');
const valueInput = document.getElementById('valueInput');
const fromUnitSelect = document.getElementById('fromUnitSelect');
const toUnitSelect = document.getElementById('toUnitSelect');
const conversionResult = document.getElementById('conversionResult');
const currencyAmount = document.getElementById('currencyAmount');
const currencyFrom = document.getElementById('currencyFrom');
const currencyTo = document.getElementById('currencyTo');
const currencyResult = document.getElementById('currencyResult');
const currencyStatus = document.getElementById('currencyStatus');
const graphFunctionInput = document.getElementById('graphFunction');
const plotGraphBtn = document.getElementById('plotGraphBtn');
const resetGraphBtn = document.getElementById('resetGraphBtn');
const graphMessage = document.getElementById('graphMessage');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomLevelLabel = document.getElementById('zoomLevelLabel');
const formulaList = document.getElementById('formulaList');
const historyList = document.getElementById('historyList');
const historySearchInput = document.getElementById('historySearch');
const exportHistoryBtn = document.getElementById('exportHistoryBtn');
const importHistoryInput = document.getElementById('importHistoryInput');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const devLoadTime = document.getElementById('loadTimeValue');
const devStorageUsage = document.getElementById('storageUsage');
const devOnlineStatus = document.getElementById('onlineStatus');
const devOfflineStatus = document.getElementById('offlineStatus');
const devThemeStatus = document.getElementById('themeStatus');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Setup accessibility
  setupKeyboardNavigation();
  setReducedMotion();
  
  // Load theme from storage manager
  const theme = storage.get('theme', 'dark');
  applyTheme(theme);
  rightThemeValue.textContent = theme.toUpperCase();
  devThemeStatus.textContent = theme.toUpperCase();

  // Load memory
  updateMemoryUI();
  
  // Load history
  updateHistoryUI();

  // Setup navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      navigateTo(section);
      activeSection = section;
      announceMessage(`Navigated to ${section}`);
    });
  });

  // Mode buttons
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.calcMode;
      scientificMode = currentMode === 'scientific';
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateCalcModeUI();
    });
  });

  // Theme toggle
  themeToggleBtn.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
    applyTheme(newTheme);
    storage.set('theme', newTheme);
    rightThemeValue.textContent = newTheme.toUpperCase();
    devThemeStatus.textContent = newTheme.toUpperCase();
    announceMessage(`Theme changed to ${newTheme}`);
  });

  // Copy result
  copyBtn.addEventListener('click', () => {
    if (currentResult !== 'Error' && currentResult !== '—') {
      navigator.clipboard.writeText(currentResult).then(() => {
        showToast('COPIED');
        announceMessage('Result copied to clipboard');
      }).catch(() => showToast('CLIPBOARD UNAVAILABLE'));
    }
  });

  // Memory buttons
  document.getElementById('memoryClear').addEventListener('click', () => { 
    memory.clear(); 
    updateMemoryUI(); 
    announceMessage('Memory cleared');
  });
  document.getElementById('memoryRecall').addEventListener('click', () => { 
    currentExpression = memory.get().toString(); 
    currentResult = memory.get().toString(); 
    updateDisplay(); 
  });
  document.getElementById('memoryAdd').addEventListener('click', () => { 
    memory.add(currentResult); 
    updateMemoryUI(); 
    announceMessage('Added to memory');
  });
  document.getElementById('memorySubtract').addEventListener('click', () => { 
    memory.subtract(currentResult); 
    updateMemoryUI(); 
    announceMessage('Subtracted from memory');
  });

  // Keyboard support
  document.addEventListener('keydown', handleKeyboard);

  // Converter setup
  setupConverter();

  // Currency setup
  setupCurrency();

  // Graph setup
  setupGraph();

  // Formula render
  renderFormulas();

  // History actions
  setupHistoryActions();

  // Dev performance
  setTimeout(() => {
    devLoadTime.textContent = performance.now().toFixed(1) + 'ms';
    devStorageUsage.textContent = calculateStorageUsage();
    devOnlineStatus.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
    devOfflineStatus.textContent = navigator.onLine ? 'READY' : 'OFFLINE';
    rightOfflineValue.textContent = navigator.onLine ? 'READY' : 'OFFLINE';
  }, 100);

  // Build keypad
  buildCalculatorKeypad();
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeColorMeta').content = '#EDF0F3';
  } else {
    document.body.classList.remove('light');
    document.getElementById('themeColorMeta').content = '#08090C';
  }
}

function updateMemoryUI() {
  const val = memory.get();
  memoryValueSpan.textContent = val;
  rightMemoryValue.textContent = val;
  storage.set('memory', val);
}

function updateDisplay() {
  expressionDisplay.textContent = currentExpression || '0';
  resultDisplay.textContent = currentResult;
}

function updateCalcModeUI() {
  if (scientificMode) {
    document.body.classList.add('scientific-mode');
    calcModeIndicator.textContent = 'SCIENTIFIC';
    buildCalculatorKeypad();
  } else {
    document.body.classList.remove('scientific-mode');
    calcModeIndicator.textContent = 'STANDARD';
    buildCalculatorKeypad();
  }
}

function buildCalculatorKeypad() {
  const keypad = document.getElementById('calcKeypad');
  keypad.innerHTML = '';
  const standardKeys = [
    'AC', '±', '⌫', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '−',
    '1', '2', '3', '+',
    '0', '.', '%', '='
  ];
  const scientificKeys = [
    'sin', 'cos', 'tan', 'asin', 'acos',
    'atan', 'log', 'ln', 'sqrt', 'x²',
    'xʸ', 'π', 'e', '1/x', '10ˣ',
    'n!', '(', ')', 'DEG', 'RAD'
  ];

  if (scientificMode) {
    const sciContainer = document.createElement('div');
    sciContainer.className = 'scientific-keys';
    scientificKeys.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'key-btn sci';
      btn.textContent = key;
      btn.setAttribute('aria-label', key);
      btn.addEventListener('click', () => handleScientificKey(key));
      sciContainer.appendChild(btn);
    });
    keypad.appendChild(sciContainer);
  }

  const mainGrid = document.createElement('div');
  mainGrid.className = 'main-key-grid';
  mainGrid.style.display = 'grid';
  mainGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  mainGrid.style.gap = '8px';

  standardKeys.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'key-btn';
    if (key === '=') btn.classList.add('equals');
    if (['÷','×','−','+'].includes(key)) btn.classList.add('operator');
    if (key === 'AC' || key === '⌫') btn.classList.add('danger');
    btn.textContent = key;
    btn.setAttribute('aria-label', key);
    btn.addEventListener('click', () => handleStandardKey(key));
    mainGrid.appendChild(btn);
  });
  keypad.appendChild(mainGrid);
}

function handleStandardKey(key) {
  switch(key) {
    case 'AC': currentExpression = ''; currentResult = '0'; break;
    case '±': currentExpression = currentExpression.startsWith('-') ? currentExpression.slice(1) : '-' + currentExpression; break;
    case '⌫': currentExpression = currentExpression.slice(0, -1); break;
    case '÷': currentExpression += '÷'; break;
    case '×': currentExpression += '×'; break;
    case '−': currentExpression += '−'; break;
    case '+': currentExpression += '+'; break;
    case '.': currentExpression += '.'; break;
    case '%': currentExpression += '%'; break;
    case '=': calculateResult(); break;
    default: currentExpression += key;
  }
  updateDisplay();
  if (key === '=') storeHistoryIfValid();
}

function handleScientificKey(key) {
  if (key === 'DEG' || key === 'RAD') {
    angleMode = key === 'DEG' ? 'deg' : 'rad';
    showToast('ANGLE MODE: ' + key);
    announceMessage(`Angle mode set to ${key}`);
    return;
  }
  
  switch(key) {
    case 'x²':
      currentExpression += '^2';
      break;
    case 'xʸ':
      currentExpression += '^';
      break;
    case 'π':
      currentExpression += 'π';
      break;
    case 'e':
      currentExpression += 'e';
      break;
    case '1/x':
      currentExpression = `1/(${currentExpression})`;
      break;
    case '10ˣ':
      currentExpression = `10^(${currentExpression})`;
      break;
    case 'n!':
      currentExpression += '!';
      break;
    default:
      currentExpression += key + '(';
  }
  updateDisplay();
}

function calculateResult() {
  try {
    const formatted = currentExpression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/%/g, '/100');
    const tokens = tokenizer(formatted);
    const result = parseExpression(tokens);
    
    if (scientificMode) {
      const scientificResult = scientificEvaluate(currentExpression, angleMode);
      if (scientificResult !== null) {
        currentResult = formatResult(scientificResult);
      } else {
        currentResult = formatResult(result);
      }
    } else {
      currentResult = formatResult(result);
    }
    
    if (currentResult === 'Infinity' || currentResult === 'NaN' || currentResult.includes('NaN')) {
      currentResult = 'Error';
      announceMessage('Calculation error');
    }
  } catch (e) {
    currentResult = 'Error';
    announceMessage('Invalid expression');
  }
  updateDisplay();
}

function storeHistoryIfValid() {
  if (currentResult !== 'Error' && currentExpression) {
    historyManager.add(currentExpression, currentResult);
    updateHistoryUI();
  }
}

function handleKeyboard(e) {
  const key = e.key;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  
  if (key >= '0' && key <= '9') { currentExpression += key; e.preventDefault(); }
  else if (key === '+') { currentExpression += '+'; e.preventDefault(); }
  else if (key === '-') { currentExpression += '−'; e.preventDefault(); }
  else if (key === '*') { currentExpression += '×'; e.preventDefault(); }
  else if (key === '/') { currentExpression += '÷'; e.preventDefault(); }
  else if (key === '.') { currentExpression += '.'; e.preventDefault(); }
  else if (key === 'Enter') { calculateResult(); storeHistoryIfValid(); e.preventDefault(); }
  else if (key === 'Backspace') { currentExpression = currentExpression.slice(0,-1); e.preventDefault(); }
  else if (key === 'Escape') { currentExpression = ''; currentResult = '0'; e.preventDefault(); }
  else if (key === '%') { currentExpression += '%'; e.preventDefault(); }
  else if (key === '(' || key === ')') { currentExpression += key; e.preventDefault(); }
  updateDisplay();
}

// Converter setup
function setupConverter() {
  const categories = Object.keys(conversionCategories);
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.toUpperCase();
    categorySelect.appendChild(opt);
  });
  populateUnits(categories[0]);
  categorySelect.addEventListener('change', () => populateUnits(categorySelect.value));
  valueInput.addEventListener('input', performConversion);
  fromUnitSelect.addEventListener('change', performConversion);
  toUnitSelect.addEventListener('change', performConversion);
}

function populateUnits(category) {
  const units = conversionCategories[category];
  fromUnitSelect.innerHTML = '';
  toUnitSelect.innerHTML = '';
  units.forEach(unit => {
    fromUnitSelect.appendChild(new Option(unit, unit));
    toUnitSelect.appendChild(new Option(unit, unit));
  });
  toUnitSelect.selectedIndex = 1;
  performConversion();
}

function performConversion() {
  const category = categorySelect.value;
  const value = parseFloat(valueInput.value);
  const from = fromUnitSelect.value;
  const to = toUnitSelect.value;
  if (!isNaN(value)) {
    const result = convertUnit(category, value, from, to);
    conversionResult.textContent = result ? result.toFixed(6) : '—';
  }
}

// Currency setup
async function setupCurrency() {
  try {
    const rates = await fetchCurrencyRates('USD');
    if (rates) {
      currencyStatus.textContent = 'LIVE RATES AVAILABLE';
      currencyStatus.style.color = 'var(--accent)';
      
      const updateCurrency = async () => {
        const amount = parseFloat(currencyAmount.value);
        const from = currencyFrom.value;
        const to = currencyTo.value;
        if (!isNaN(amount)) {
          const result = await convertCurrency(amount, from, to);
          currencyResult.textContent = result ? result.toFixed(4) : 'ERROR';
        }
      };
      
      currencyAmount.addEventListener('input', updateCurrency);
      currencyFrom.addEventListener('change', updateCurrency);
      currencyTo.addEventListener('change', updateCurrency);
      updateCurrency();
    }
  } catch (e) {
    currencyStatus.textContent = 'LIVE RATES UNAVAILABLE';
  }
}

// Graph setup
let graphZoomLevel = 1.0;
function setupGraph() {
  plotGraphBtn.addEventListener('click', () => {
    const fn = graphFunctionInput.value;
    try {
      if (validateFunction(fn)) {
        renderGraph(fn);
        graphMessage.textContent = '';
      } else {
        graphMessage.textContent = 'UNABLE TO PLOT FUNCTION';
      }
    } catch (e) {
      graphMessage.textContent = 'UNABLE TO PLOT FUNCTION';
    }
  });
  
  resetGraphBtn.addEventListener('click', () => {
    graphFunctionInput.value = 'x^2';
    resetGraphView();
    resetView();
    renderGraph('x^2');
    graphZoomLevel = 1.0;
    zoomLevelLabel.textContent = '1.0x';
  });
  
  zoomInBtn.addEventListener('click', () => { 
    graphZoomLevel *= 1.2; 
    zoomLevelLabel.textContent = graphZoomLevel.toFixed(1)+'x'; 
    zoomIn();
    controlZoomIn();
    renderGraph(graphFunctionInput.value);
  });
  
  zoomOutBtn.addEventListener('click', () => { 
    graphZoomLevel /= 1.2; 
    zoomLevelLabel.textContent = graphZoomLevel.toFixed(1)+'x'; 
    zoomOut();
    controlZoomOut();
    renderGraph(graphFunctionInput.value);
  });
  
  renderGraph('x^2');
}

// Formula rendering
function renderFormulas() {
  formulaList.innerHTML = '';
  
  const allFormulas = [
    { category: 'MATHEMATICS', formulas: formulaLibrary },
    { category: 'PHYSICS', formulas: physicsFormulas },
    { category: 'GEOMETRY', formulas: geometryFormulas }
  ];
  
  allFormulas.forEach(({ category, formulas }) => {
    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = category;
    categoryHeader.style.color = 'var(--accent)';
    categoryHeader.style.marginTop = '20px';
    categoryHeader.style.marginBottom = '10px';
    categoryHeader.style.letterSpacing = '2px';
    formulaList.appendChild(categoryHeader);
    
    formulas.forEach(f => {
      const card = document.createElement('div');
      card.className = 'formula-card';
      card.style.border = '1px solid var(--border)';
      card.style.borderRadius = '6px';
      card.style.padding = '12px';
      card.style.marginBottom = '8px';
      
      const name = document.createElement('strong');
      name.textContent = f.name;
      
      const formula = document.createElement('code');
      formula.textContent = f.formula;
      formula.style.display = 'block';
      formula.style.margin = '8px 0';
      
      const explanation = document.createElement('span');
      explanation.textContent = f.explanation;
      explanation.style.color = 'var(--text-muted)';
      explanation.style.fontSize = '12px';
      
      card.appendChild(name);
      card.appendChild(formula);
      card.appendChild(explanation);
      formulaList.appendChild(card);
    });
  });
}

// History actions
function updateHistoryUI() {
  const items = historyManager.getAll();
  historyList.innerHTML = '';
  if (items.length === 0) {
    historyList.innerHTML = '<div class="empty-state">NO CALCULATIONS YET</div>';
    return;
  }
  items.slice().reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    
    const infoDiv = document.createElement('div');
    infoDiv.innerHTML = `
      <div class="history-expr">${item.expression}</div>
      <div class="history-result">${item.result}</div>
      <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
    `;
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'history-actions';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'history-delete';
    deleteBtn.setAttribute('data-id', item.id);
    deleteBtn.setAttribute('aria-label', 'Delete entry');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      historyManager.remove(item.id);
      updateHistoryUI();
      showToast('ENTRY DELETED');
    });
    
    actionsDiv.appendChild(deleteBtn);
    div.appendChild(infoDiv);
    div.appendChild(actionsDiv);
    
    div.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        currentExpression = item.expression;
        currentResult = item.result;
        updateDisplay();
        announceMessage('History entry loaded');
      }
    });
    
    historyList.appendChild(div);
  });
}

function setupHistoryActions() {
  historySearchInput.addEventListener('input', () => {
    const query = historySearchInput.value;
    const results = historySearch(historyManager.getAll(), query);
    historyList.innerHTML = '';
    if (results.length === 0) {
      historyList.innerHTML = '<div class="empty-state">NO MATCHES FOUND</div>';
      return;
    }
    results.slice().reverse().forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div>
          <div class="history-expr">${item.expression}</div>
          <div class="history-result">${item.result}</div>
          <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
        </div>
      `;
      historyList.appendChild(div);
    });
  });
  
  exportHistoryBtn.addEventListener('click', () => {
    exportHistory(historyManager.getAll());
    showToast('HISTORY EXPORTED');
  });
  
  importHistoryInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      importHistory(file).then((items) => {
        historyManager.importItems(items);
        updateHistoryUI();
        showToast('HISTORY IMPORTED');
        announceMessage('History imported successfully');
      }).catch(() => {
        showToast('INVALID FILE');
        announceMessage('Invalid history file');
      });
    }
  });
  
  clearHistoryBtn.addEventListener('click', () => {
    showModal({
      title: 'CLEAR HISTORY',
      content: 'Are you sure you want to clear all calculation history?',
      onConfirm: () => {
        historyManager.clear();
        updateHistoryUI();
        showToast('HISTORY CLEARED');
        announceMessage('History cleared');
      }
    });
  });
}

function calculateStorageUsage() {
  return (storage.getStorageSize() / 1024).toFixed(1) + ' KB';
}

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      console.warn('Service worker registration failed');
    });
  });
           }
