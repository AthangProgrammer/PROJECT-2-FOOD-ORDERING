import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const foodsRaw = fs.readFileSync(path.join(rootDir, 'data', 'foods.json'), 'utf-8');
const foodsData = JSON.parse(foodsRaw);

console.log('=== RUNNING AUTOMATED ONLINE FOOD ORDERING SYSTEM TESTS (PROGRAM 1) ===\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  // Setup JSDOM environment
  const dom = new JSDOM(htmlContent, {
    url: 'http://localhost:5173/',
    runScripts: 'dangerously'
  });

  const { window } = dom;
  const { document } = window;

  // Intercept fetch for GET foods.json and POST order
  let postRequestDispatched = null;

  window.fetch = async (url, options = {}) => {
    if (url === 'data/foods.json' || url.endsWith('/data/foods.json')) {
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => JSON.parse(foodsRaw)
      };
    }

    if (url === 'http://localhost:5000/api/orders') {
      postRequestDispatched = {
        url,
        method: options.method,
        headers: options.headers,
        body: JSON.parse(options.body)
      };
      // Simulate network error because backend server on 5000 is not yet implemented in Program 1
      const netError = new TypeError('Failed to fetch (Backend offline in Program 1)');
      throw netError;
    }

    throw new Error(`Unhandled fetch url: ${url}`);
  };

  // Mock scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = () => {};

  // Load and execute app.js in window context
  const appJsCode = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf-8');
  window.eval(appJsCode);

  // Trigger DOMContentLoaded
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

  // Wait a tick for async fetchFoodCatalog to finish
  await new Promise(resolve => setTimeout(resolve, 80));

  // ----------------------------------------------------
  // TEST SUITE 1: Food Catalog Display (GET Request & Fetch API)
  // ----------------------------------------------------
  console.log('Test Suite 1: Food Items Catalog Display (Fetch API & GET)');
  const foodCards = document.querySelectorAll('#foodContainer .food-card');
  assert(foodCards.length === 12, `Rendered ${foodCards.length} food cards (expected 12 from foods.json)`);

  const resultsCount = document.getElementById('resultsCount');
  assert(resultsCount.textContent.includes('Showing all 12 delicious dishes'), `Results count updated: "${resultsCount.textContent}"`);

  const firstCard = foodCards[0];
  const firstTitle = firstCard.querySelector('.food-title').textContent;
  const firstPrice = firstCard.querySelector('.food-price').textContent;
  const firstCat = firstCard.querySelector('.food-card-category-tag').textContent;
  const firstImg = firstCard.querySelector('.food-card-img');

  assert(firstTitle === 'Margherita Classic Pizza', `First food item name matches: "${firstTitle}"`);
  assert(firstPrice === '$12.99', `First food item price formatted correctly: "${firstPrice}"`);
  assert(firstCat === 'Pizza', `First food item category tag: "${firstCat}"`);
  assert(firstImg && firstImg.getAttribute('src').startsWith('https://'), `First food item image source present`);

  // ----------------------------------------------------
  // TEST SUITE 2: Search by Food Name
  // ----------------------------------------------------
  console.log('\nTest Suite 2: Search Food Items by Name');
  const searchInput = document.getElementById('searchInput');
  
  // Search for "burger"
  searchInput.value = 'burger';
  searchInput.dispatchEvent(new window.Event('input'));

  let searchedCards = document.querySelectorAll('#foodContainer .food-card');
  assert(searchedCards.length === 3, `Searching "burger" displays 3 items (got ${searchedCards.length})`);
  assert(resultsCount.textContent.includes('Showing 3 of 12 dishes'), `Results count updated for search: "${resultsCount.textContent}"`);

  // Search non-existent food
  searchInput.value = 'DragonFruitSmoothieXYZ';
  searchInput.dispatchEvent(new window.Event('input'));
  const emptyState = document.getElementById('emptyState');
  assert(emptyState.style.display !== 'none', 'Empty state displayed when no food items match search');

  // Reset search
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  clearSearchBtn.dispatchEvent(new window.Event('click'));
  assert(document.querySelectorAll('#foodContainer .food-card').length === 12, 'Clearing search restored all 12 food items');

  // ----------------------------------------------------
  // TEST SUITE 3: Filter by Category
  // ----------------------------------------------------
  console.log('\nTest Suite 3: Filter by Category');
  const categoryFilter = document.getElementById('categoryFilter');

  categoryFilter.value = 'Pasta';
  categoryFilter.dispatchEvent(new window.Event('change'));

  let pastaCards = document.querySelectorAll('#foodContainer .food-card');
  assert(pastaCards.length === 3, `Filtered category "Pasta" displays 3 items (got ${pastaCards.length})`);

  // Quick category pill click
  const pizzaPill = document.querySelector('.category-pills [data-category="Pizza"]');
  pizzaPill.dispatchEvent(new window.Event('click', { bubbles: true }));

  let pizzaCards = document.querySelectorAll('#foodContainer .food-card');
  assert(pizzaCards.length === 3, `Clicked "Pizza" pill displays 3 items (got ${pizzaCards.length})`);
  assert(categoryFilter.value === 'Pizza', 'Category select synchronized with category pill');

  // Reset filters
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  resetFiltersBtn.dispatchEvent(new window.Event('click'));
  assert(document.querySelectorAll('#foodContainer .food-card').length === 12, 'Reset filters button restored all 12 items');

  // ----------------------------------------------------
  // TEST SUITE 4: Sort Food Items by Price
  // ----------------------------------------------------
  console.log('\nTest Suite 4: Sort Food Items by Price');
  const sortSelect = document.getElementById('sortSelect');

  // Low to High
  sortSelect.value = 'price-asc';
  sortSelect.dispatchEvent(new window.Event('change'));

  let sortedCards = document.querySelectorAll('#foodContainer .food-card');
  const cheapestTitle = sortedCards[0].querySelector('.food-title').textContent;
  const cheapestPrice = sortedCards[0].querySelector('.food-price').textContent;
  assert(cheapestTitle === 'Iced Berry Lemonade Cooler', `Cheapest item is "${cheapestTitle}" (${cheapestPrice})`);

  // High to Low
  sortSelect.value = 'price-desc';
  sortSelect.dispatchEvent(new window.Event('change'));
  sortedCards = document.querySelectorAll('#foodContainer .food-card');
  const priciestTitle = sortedCards[0].querySelector('.food-title').textContent;
  const priciestPrice = sortedCards[0].querySelector('.food-price').textContent;
  assert(priciestTitle === 'Truffle Mushroom Pizza', `Most expensive item is "${priciestTitle}" (${priciestPrice})`);

  // Reset sort
  sortSelect.value = 'default';
  sortSelect.dispatchEvent(new window.Event('change'));

  // ----------------------------------------------------
  // TEST SUITE 5: Shopping Cart - Add Items
  // ----------------------------------------------------
  console.log('\nTest Suite 5: Shopping Cart - Add Items');
  const firstAddBtn = document.querySelector('.food-card[data-id="1"] [data-action="add-to-cart"]');
  firstAddBtn.dispatchEvent(new window.Event('click', { bubbles: true }));

  const secondAddBtn = document.querySelector('.food-card[data-id="4"] [data-action="add-to-cart"]');
  secondAddBtn.dispatchEvent(new window.Event('click', { bubbles: true }));

  const cartBadge = document.getElementById('cartCountBadge');
  assert(cartBadge.textContent === '2', `Cart badge shows 2 items (got ${cartBadge.textContent})`);

  let cartItems = document.querySelectorAll('#cartItemsList .cart-item');
  assert(cartItems.length === 2, `Cart drawer contains 2 distinct food items`);

  // ----------------------------------------------------
  // TEST SUITE 6: Cart Quantities & Total Calculation
  // ----------------------------------------------------
  console.log('\nTest Suite 6: Update Cart Quantities & Totals Calculation');
  // Increase quantity of first item
  const increaseBtn = document.querySelector('#cartItemsList .cart-item[data-id="1"] [data-action="qty-increase"]');
  increaseBtn.dispatchEvent(new window.Event('click', { bubbles: true }));

  assert(cartBadge.textContent === '3', `After increment, cart badge shows 3 items`);

  // Item 1: Margherita ($12.99 * 2 = $25.98)
  // Item 4: Cheeseburger ($11.99 * 1 = $11.99)
  // Subtotal = $37.97 (>= $25.00 => Free Delivery = $0.00)
  // Tax (5%) = 37.97 * 0.05 = $1.90
  // Total = $39.87
  const cartSubtotal = document.getElementById('cartSubtotal').textContent;
  const cartDeliveryFee = document.getElementById('cartDeliveryFee').textContent;
  const cartTotal = document.getElementById('cartTotal').textContent;

  assert(cartSubtotal === '$37.97', `Subtotal correctly calculated: ${cartSubtotal} (expected $37.97)`);
  assert(cartDeliveryFee === 'FREE', `Delivery fee unlocked FREE since subtotal >= $25`);
  assert(cartTotal === '$39.87', `Grand total calculated correctly: ${cartTotal} (expected $39.87)`);

  // ----------------------------------------------------
  // TEST SUITE 7: Checkout Form & Validation
  // ----------------------------------------------------
  console.log('\nTest Suite 7: Checkout Form Validation');
  const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
  proceedCheckoutBtn.dispatchEvent(new window.Event('click'));

  const checkoutBackdrop = document.getElementById('checkoutBackdrop');
  assert(checkoutBackdrop.style.display === 'flex', 'Checkout modal opened upon clicking proceed');

  // Submit with empty inputs
  const checkoutForm = document.getElementById('checkoutForm');
  checkoutForm.dispatchEvent(new window.Event('submit', { cancelable: true }));

  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const addressError = document.getElementById('addressError');

  assert(nameError.style.display !== 'none', 'Name validation error displayed for empty name');
  assert(phoneError.style.display !== 'none', 'Phone validation error displayed for empty phone');
  assert(addressError.style.display !== 'none', 'Address validation error displayed for empty address');

  // Fill in valid details
  const custName = document.getElementById('custName');
  const custPhone = document.getElementById('custPhone');
  const custAddress = document.getElementById('custAddress');

  custName.value = 'Alexander Hamilton';
  custPhone.value = '9876543210';
  custAddress.value = 'Suite 101, 742 Evergreen Terrace';

  // ----------------------------------------------------
  // TEST SUITE 8 & 10: Order Submission (POST) & Confirmation
  // ----------------------------------------------------
  console.log('\nTest Suite 8 & 10: Order Submission (POST Request) & Order Confirmation');
  
  await checkoutForm.dispatchEvent(new window.Event('submit', { cancelable: true }));
  // Allow async fetch POST attempt to complete
  await new Promise(resolve => setTimeout(resolve, 50));

  assert(postRequestDispatched !== null, 'Prepared HTTP POST request was dispatched to backend API');
  assert(postRequestDispatched.method === 'POST', 'HTTP Method is POST');
  assert(postRequestDispatched.headers['Content-Type'] === 'application/json', 'Content-Type header is application/json');
  assert(postRequestDispatched.body.customer.name === 'Alexander Hamilton', `Dispatched JSON payload includes customer name`);
  assert(postRequestDispatched.body.items.length === 2, `Dispatched JSON payload contains 2 items`);

  const confirmModal = document.getElementById('orderConfirmationModal');
  assert(confirmModal.style.display === 'flex', 'Order Confirmation Modal displayed successfully');

  const confirmOrderId = document.getElementById('confirmOrderId').textContent;
  assert(confirmOrderId.startsWith('#ORD-'), `Valid Order Reference ID generated: "${confirmOrderId}"`);

  const confirmTotalPaid = document.getElementById('confirmTotalPaid').textContent;
  assert(confirmTotalPaid === '$39.87', `Receipt displays total paid: "${confirmTotalPaid}"`);

  // ----------------------------------------------------
  // TEST SUITE 9: Live Order Status Tracking
  // ----------------------------------------------------
  console.log('\nTest Suite 9: Live Order Status Tracker & Advancement');
  const currentStatusBadge = document.getElementById('currentStatusBadge');
  assert(currentStatusBadge.textContent === 'Cooking in Kitchen', `Status begins at Preparing: "${currentStatusBadge.textContent}"`);

  const advanceStatusBtn = document.getElementById('advanceStatusBtn');
  // Advance to Out for Delivery
  advanceStatusBtn.dispatchEvent(new window.Event('click'));
  assert(currentStatusBadge.textContent === 'Rider on the Way', `Advanced to step 3: "${currentStatusBadge.textContent}"`);

  // Advance to Delivered
  advanceStatusBtn.dispatchEvent(new window.Event('click'));
  assert(currentStatusBadge.textContent === 'Delivered Warm!', `Advanced to step 4 Delivered: "${currentStatusBadge.textContent}"`);

  // Cart was cleared after order placement
  assert(cartBadge.textContent === '0', 'Cart badge reset to 0 after placing order');

  // Summary
  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
  console.log('======================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
