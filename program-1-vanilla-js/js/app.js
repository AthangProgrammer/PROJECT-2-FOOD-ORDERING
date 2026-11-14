/**
 * BiteExpress - Online Food Ordering System
 * Program 1: Vanilla JavaScript Implementation
 * 
 * Features:
 *  1. Async/await Fetch API for catalog loading (GET)
 *  2. Search food items by name
 *  3. Filter food items by category
 *  4. Sort food items by price / rating / name
 *  5. Shopping cart management (Add, update quantity, remove, calculate total)
 *  6. Checkout form with comprehensive client-side validation
 *  7. Prepared HTTP POST request for order submission with standalone simulation fallback
 *  8. Order confirmation & live order status tracker with demo advancement
 */

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================
const APP_CONFIG = {
  FOODS_DATA_URL: 'data/foods.json',
  ORDERS_API_ENDPOINT: 'http://localhost:5000/api/orders', // Planned for Program 3 & 4
  DELIVERY_FEE: 2.99,
  FREE_DELIVERY_THRESHOLD: 25.00,
  TAX_RATE: 0.05, // 5%
  STORAGE_KEY_CART: 'biteexpress_cart_items'
};

// Fallback food image placeholder in SVG data URI format (in case of offline/network issues)
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3e%3crect fill='%23f1f5f9' width='600' height='400'/%3e%3ctext fill='%2394a3b8' font-family='sans-serif' font-size='26' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3e%F0%9F%8D%BD%EF%B8%8F Delicious Meal%3c/text%3e%3c/svg%3e";

// ==========================================
// 2. APPLICATION STATE
// ==========================================
const state = {
  foods: [],
  cart: [],
  searchQuery: '',
  selectedCategory: 'all',
  selectedSort: 'default',
  currentOrder: null,
  orderStatusStep: 1 // 1: Placed, 2: Preparing, 3: Out for Delivery, 4: Delivered
};

// ==========================================
// 3. DOM ELEMENTS CACHE
// ==========================================
const DOM = {};

function initDOMElements() {
  DOM.searchInput = document.getElementById('searchInput');
  DOM.clearSearchBtn = document.getElementById('clearSearchBtn');
  DOM.categoryFilter = document.getElementById('categoryFilter');
  DOM.sortSelect = document.getElementById('sortSelect');
  DOM.resetFiltersBtn = document.getElementById('resetFiltersBtn');
  DOM.categoryPills = document.getElementById('categoryPills');
  DOM.resultsCount = document.getElementById('resultsCount');
  
  DOM.loadingSpinner = document.getElementById('loadingSpinner');
  DOM.errorMessage = document.getElementById('errorMessage');
  DOM.errorTitle = document.getElementById('errorTitle');
  DOM.errorDescription = document.getElementById('errorDescription');
  DOM.retryFetchBtn = document.getElementById('retryFetchBtn');
  DOM.emptyState = document.getElementById('emptyState');
  DOM.emptyResetBtn = document.getElementById('emptyResetBtn');
  DOM.foodContainer = document.getElementById('foodContainer');

  DOM.cartToggleBtn = document.getElementById('cartToggleBtn');
  DOM.cartCountBadge = document.getElementById('cartCountBadge');
  DOM.heroCartCount = document.getElementById('heroCartCount');
  DOM.heroViewCartBtn = document.getElementById('heroViewCartBtn');
  DOM.drawerCartBadge = document.getElementById('drawerCartBadge');
  DOM.cartDrawer = document.getElementById('cartDrawer');
  DOM.cartBackdrop = document.getElementById('cartBackdrop');
  DOM.closeCartBtn = document.getElementById('closeCartBtn');
  DOM.cartItemsList = document.getElementById('cartItemsList');
  DOM.cartEmptyState = document.getElementById('cartEmptyState');
  DOM.cartFooter = document.getElementById('cartFooter');
  DOM.cartSubtotal = document.getElementById('cartSubtotal');
  DOM.cartDeliveryFee = document.getElementById('cartDeliveryFee');
  DOM.cartTax = document.getElementById('cartTax');
  DOM.cartTotal = document.getElementById('cartTotal');
  DOM.freeDeliveryHint = document.getElementById('freeDeliveryHint');
  DOM.clearCartBtn = document.getElementById('clearCartBtn');
  DOM.cartBrowseBtn = document.getElementById('cartBrowseBtn');
  DOM.proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');

  DOM.checkoutBackdrop = document.getElementById('checkoutBackdrop');
  DOM.closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  DOM.cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');
  DOM.checkoutForm = document.getElementById('checkoutForm');
  DOM.custName = document.getElementById('custName');
  DOM.custPhone = document.getElementById('custPhone');
  DOM.custAddress = document.getElementById('custAddress');
  DOM.custNotes = document.getElementById('custNotes');
  DOM.nameError = document.getElementById('nameError');
  DOM.phoneError = document.getElementById('phoneError');
  DOM.addressError = document.getElementById('addressError');
  DOM.checkoutSummaryItems = document.getElementById('checkoutSummaryItems');
  DOM.checkoutSubtotal = document.getElementById('checkoutSubtotal');
  DOM.checkoutDelivery = document.getElementById('checkoutDelivery');
  DOM.checkoutTax = document.getElementById('checkoutTax');
  DOM.checkoutGrandTotal = document.getElementById('checkoutGrandTotal');
  DOM.placeOrderBtn = document.getElementById('placeOrderBtn');
  DOM.placeOrderBtnText = document.getElementById('placeOrderBtnText');
  DOM.placeOrderSpinner = document.getElementById('placeOrderSpinner');

  DOM.orderConfirmationModal = document.getElementById('orderConfirmationModal');
  DOM.closeConfirmBtn = document.getElementById('closeConfirmBtn');
  DOM.orderAnotherBtn = document.getElementById('orderAnotherBtn');
  DOM.confirmOrderId = document.getElementById('confirmOrderId');
  DOM.confirmOrderTime = document.getElementById('confirmOrderTime');
  DOM.currentStatusBadge = document.getElementById('currentStatusBadge');
  DOM.statusProgressBar = document.getElementById('statusProgressBar');
  DOM.advanceStatusBtn = document.getElementById('advanceStatusBtn');
  DOM.confirmName = document.getElementById('confirmName');
  DOM.confirmPhone = document.getElementById('confirmPhone');
  DOM.confirmAddress = document.getElementById('confirmAddress');
  DOM.confirmPayment = document.getElementById('confirmPayment');
  DOM.confirmItemsList = document.getElementById('confirmItemsList');
  DOM.confirmTotalPaid = document.getElementById('confirmTotalPaid');
  DOM.httpPostStatusText = document.getElementById('httpPostStatusText');
  
  DOM.toastContainer = document.getElementById('toastContainer');
}

// ==========================================
// 4. DATA FETCHING (GET Request with Fetch API)
// ==========================================
async function fetchFoodCatalog() {
  setLoading(true);
  hideError();

  try {
    const response = await fetch(APP_CONFIG.FOODS_DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error: Failed to fetch food data (Status: ${response.status} ${response.statusText})`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Received empty or invalid food catalog data.');
    }

    state.foods = data;
    populateCategoryOptions(data);
    applyFiltersAndRender();
  } catch (error) {
    console.error('Error in fetchFoodCatalog:', error);
    showError(
      'Unable to Load Food Menu',
      `${error.message}. Please make sure you are serving the project using a local HTTP server (e.g., npx serve or Live Server).`
    );
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  if (DOM.loadingSpinner) {
    DOM.loadingSpinner.style.display = isLoading ? 'block' : 'none';
  }
  if (DOM.foodContainer) {
    DOM.foodContainer.style.display = isLoading ? 'none' : 'grid';
  }
}

function showError(title, message) {
  if (DOM.errorMessage) {
    DOM.errorMessage.style.display = 'flex';
    if (DOM.errorTitle) DOM.errorTitle.textContent = title;
    if (DOM.errorDescription) DOM.errorDescription.textContent = message;
  }
  if (DOM.foodContainer) DOM.foodContainer.style.display = 'none';
  if (DOM.emptyState) DOM.emptyState.style.display = 'none';
  if (DOM.resultsCount) DOM.resultsCount.textContent = 'Failed to load menu.';
}

function hideError() {
  if (DOM.errorMessage) {
    DOM.errorMessage.style.display = 'none';
  }
}

// Dynamically extract categories and populate dropdown options
function populateCategoryOptions(foods) {
  if (!DOM.categoryFilter) return;

  const categories = Array.from(new Set(foods.map(item => item.category))).filter(Boolean);
  
  // Keep the 'all' option
  DOM.categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    DOM.categoryFilter.appendChild(option);
  });
}

// ==========================================
// 5. FILTERING, SEARCHING & SORTING LOGIC
// ==========================================
function getFilteredAndSortedFoods() {
  let result = [...state.foods];

  // 1. Category Filter
  if (state.selectedCategory !== 'all') {
    result = result.filter(item => 
      item.category.toLowerCase() === state.selectedCategory.toLowerCase()
    );
  }

  // 2. Search Query (Name or Description)
  if (state.searchQuery.trim() !== '') {
    const query = state.searchQuery.toLowerCase().trim();
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  }

  // 3. Sorting
  switch (state.selectedSort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'default':
    default:
      // Keep original catalog order
      result.sort((a, b) => a.id - b.id);
      break;
  }

  return result;
}

function applyFiltersAndRender() {
  const filtered = getFilteredAndSortedFoods();
  renderFoodCards(filtered);
  updateResultsCount(filtered.length, state.foods.length);
}

function updateResultsCount(shownCount, totalCount) {
  if (!DOM.resultsCount) return;

  if (totalCount === 0) {
    DOM.resultsCount.textContent = 'No food items in database.';
    return;
  }

  if (shownCount === totalCount) {
    DOM.resultsCount.textContent = `Showing all ${totalCount} delicious dishes`;
  } else {
    DOM.resultsCount.textContent = `Showing ${shownCount} of ${totalCount} dishes`;
  }
}

// ==========================================
// 6. FOOD CATALOG RENDERING
// ==========================================
function renderFoodCards(items) {
  if (!DOM.foodContainer || !DOM.emptyState) return;

  if (items.length === 0) {
    DOM.foodContainer.innerHTML = '';
    DOM.emptyState.style.display = 'block';
    return;
  }

  DOM.emptyState.style.display = 'none';

  DOM.foodContainer.innerHTML = items.map(item => `
    <article class="food-card" data-id="${item.id}">
      <div class="food-card-image-wrap">
        <img 
          src="${escapeHTML(item.image)}" 
          alt="${escapeHTML(item.name)}" 
          class="food-card-img" 
          loading="lazy"
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        />
        <span class="food-card-category-tag">${escapeHTML(item.category)}</span>
        <span class="food-card-diet-tag ${item.isVeg ? 'veg-badge' : 'non-veg-badge'}">
          ${item.isVeg ? '🌱 Veg' : '🍖 Non-Veg'}
        </span>
      </div>

      <div class="food-card-body">
        <div class="food-card-header">
          <h3 class="food-title">${escapeHTML(item.name)}</h3>
          <span class="food-rating" title="${item.rating} out of 5 stars">★ ${Number(item.rating).toFixed(1)}</span>
        </div>

        <p class="food-description">${escapeHTML(item.description)}</p>

        <div class="food-meta">
          <span class="food-prep-time">⏱️ ${escapeHTML(item.prepTime || '20-25 mins')}</span>
        </div>

        <div class="food-card-footer">
          <div class="food-price">$${Number(item.price).toFixed(2)}</div>
          <button 
            type="button" 
            class="add-to-cart-btn" 
            data-action="add-to-cart" 
            data-id="${item.id}"
            aria-label="Add ${escapeHTML(item.name)} to Cart"
          >
            <span>+ Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// ==========================================
// 7. SHOPPING CART LOGIC
// ==========================================
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.STORAGE_KEY_CART);
    if (raw) {
      state.cart = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read cart from localStorage:', err);
    state.cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_CART, JSON.stringify(state.cart));
  } catch (err) {
    console.warn('Could not persist cart to localStorage:', err);
  }
}

function addToCart(foodId) {
  const item = state.foods.find(f => f.id === Number(foodId));
  if (!item) return;

  const existingCartIndex = state.cart.findIndex(c => c.id === Number(foodId));

  if (existingCartIndex > -1) {
    state.cart[existingCartIndex].quantity += 1;
  } else {
    state.cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: 1
    });
  }

  saveCartToStorage();
  updateCartUI();
  showToast(`Added "${item.name}" to cart! 🍔`, 'success');
}

function updateCartQuantity(foodId, delta) {
  const existingCartIndex = state.cart.findIndex(c => c.id === Number(foodId));
  if (existingCartIndex === -1) return;

  state.cart[existingCartIndex].quantity += delta;

  if (state.cart[existingCartIndex].quantity <= 0) {
    state.cart.splice(existingCartIndex, 1);
    showToast('Item removed from cart', 'info');
  }

  saveCartToStorage();
  updateCartUI();
}

function removeFromCart(foodId) {
  const item = state.cart.find(c => c.id === Number(foodId));
  state.cart = state.cart.filter(c => c.id !== Number(foodId));
  saveCartToStorage();
  updateCartUI();
  if (item) {
    showToast(`Removed "${item.name}" from cart`, 'info');
  }
}

function clearEntireCart() {
  if (state.cart.length === 0) return;
  state.cart = [];
  saveCartToStorage();
  updateCartUI();
  showToast('Cart cleared', 'info');
}

function calculateCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let deliveryFee = 0;
  if (subtotal > 0) {
    deliveryFee = subtotal >= APP_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : APP_CONFIG.DELIVERY_FEE;
  }

  const tax = subtotal * APP_CONFIG.TAX_RATE;
  const grandTotal = subtotal + deliveryFee + tax;
  const totalItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
    totalItemCount
  };
}

function updateCartUI() {
  const totals = calculateCartTotals();

  // Badges
  if (DOM.cartCountBadge) DOM.cartCountBadge.textContent = totals.totalItemCount;
  if (DOM.heroCartCount) DOM.heroCartCount.textContent = totals.totalItemCount;
  if (DOM.drawerCartBadge) DOM.drawerCartBadge.textContent = `${totals.totalItemCount} items`;

  // Drawer list & visibility
  if (!DOM.cartItemsList || !DOM.cartEmptyState || !DOM.cartFooter) return;

  if (state.cart.length === 0) {
    DOM.cartItemsList.innerHTML = '';
    DOM.cartEmptyState.style.display = 'flex';
    DOM.cartFooter.style.display = 'none';
  } else {
    DOM.cartEmptyState.style.display = 'none';
    DOM.cartFooter.style.display = 'block';

    DOM.cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img 
          src="${escapeHTML(item.image)}" 
          alt="${escapeHTML(item.name)}" 
          class="cart-item-img" 
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        />
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHTML(item.name)}</div>
          <div class="cart-item-price-unit">$${Number(item.price).toFixed(2)} each</div>
          <button type="button" class="cart-item-delete" data-action="remove-item" data-id="${item.id}">Remove</button>
        </div>
        <div class="cart-item-controls">
          <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="qty-stepper">
            <button type="button" class="qty-btn" data-action="qty-decrease" data-id="${item.id}" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-count">${item.quantity}</span>
            <button type="button" class="qty-btn" data-action="qty-increase" data-id="${item.id}" aria-label="Increase quantity">&plus;</button>
          </div>
        </div>
      </div>
    `).join('');

    // Update Totals
    DOM.cartSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
    DOM.cartDeliveryFee.textContent = totals.deliveryFee === 0 ? 'FREE' : `$${totals.deliveryFee.toFixed(2)}`;
    DOM.cartTax.textContent = `$${totals.tax.toFixed(2)}`;
    DOM.cartTotal.textContent = `$${totals.grandTotal.toFixed(2)}`;

    // Free delivery hint
    if (totals.subtotal >= APP_CONFIG.FREE_DELIVERY_THRESHOLD) {
      DOM.freeDeliveryHint.textContent = '🎉 You unlocked FREE Delivery!';
      DOM.freeDeliveryHint.style.color = 'var(--success-dark)';
    } else {
      const remaining = (APP_CONFIG.FREE_DELIVERY_THRESHOLD - totals.subtotal).toFixed(2);
      DOM.freeDeliveryHint.textContent = `💡 Add $${remaining} more for FREE delivery!`;
      DOM.freeDeliveryHint.style.color = 'var(--text-muted)';
    }
  }

  // Sync Checkout preview if modal is active
  updateCheckoutSummary(totals);
}

function updateCheckoutSummary(totals) {
  if (!DOM.checkoutSummaryItems) return;

  DOM.checkoutSummaryItems.innerHTML = state.cart.map(item => `
    <div class="checkout-item-line">
      <span>${item.quantity}x ${escapeHTML(item.name)}</span>
      <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
    </div>
  `).join('');

  if (DOM.checkoutSubtotal) DOM.checkoutSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
  if (DOM.checkoutDelivery) DOM.checkoutDelivery.textContent = totals.deliveryFee === 0 ? 'FREE' : `$${totals.deliveryFee.toFixed(2)}`;
  if (DOM.checkoutTax) DOM.checkoutTax.textContent = `$${totals.tax.toFixed(2)}`;
  if (DOM.checkoutGrandTotal) DOM.checkoutGrandTotal.textContent = `$${totals.grandTotal.toFixed(2)}`;
}

// Drawer Visibility Helpers
function openCartDrawer() {
  if (DOM.cartDrawer && DOM.cartBackdrop) {
    DOM.cartDrawer.classList.add('open');
    DOM.cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  if (DOM.cartDrawer && DOM.cartBackdrop) {
    DOM.cartDrawer.classList.remove('open');
    DOM.cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ==========================================
// 8. CHECKOUT & BASIC FORM VALIDATION
// ==========================================
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty! Please add items before checking out.', 'info');
    return;
  }

  closeCartDrawer();
  const totals = calculateCartTotals();
  updateCheckoutSummary(totals);
  resetValidationErrors();

  if (DOM.checkoutBackdrop) {
    DOM.checkoutBackdrop.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (DOM.custName) DOM.custName.focus();
  }
}

function closeCheckoutModal() {
  if (DOM.checkoutBackdrop) {
    DOM.checkoutBackdrop.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function validateField(inputEl, errorEl, ruleFn, errorMsg) {
  const value = inputEl.value.trim();
  const isValid = ruleFn(value);

  if (!isValid) {
    inputEl.classList.add('is-invalid');
    errorEl.textContent = errorMsg;
    errorEl.style.display = 'block';
    return false;
  } else {
    inputEl.classList.remove('is-invalid');
    errorEl.textContent = '';
    errorEl.style.display = 'none';
    return true;
  }
}

function resetValidationErrors() {
  [DOM.custName, DOM.custPhone, DOM.custAddress].forEach(el => {
    if (el) el.classList.remove('is-invalid');
  });
  [DOM.nameError, DOM.phoneError, DOM.addressError].forEach(el => {
    if (el) {
      el.textContent = '';
      el.style.display = 'none';
    }
  });
}

function validateCheckoutForm() {
  let isFormValid = true;

  // Name: minimum 2 chars, letters/spaces
  const isNameValid = validateField(
    DOM.custName,
    DOM.nameError,
    val => val.length >= 2 && /^[a-zA-Z\s.'-]+$/.test(val),
    'Please enter a valid full name (minimum 2 letters).'
  );
  if (!isNameValid) isFormValid = false;

  // Phone: 10 digits
  const isPhoneValid = validateField(
    DOM.custPhone,
    DOM.phoneError,
    val => {
      const cleaned = val.replace(/\D/g, '');
      return cleaned.length === 10;
    },
    'Please enter a valid 10-digit phone number.'
  );
  if (!isPhoneValid) isFormValid = false;

  // Address: minimum 10 characters
  const isAddressValid = validateField(
    DOM.custAddress,
    DOM.addressError,
    val => val.length >= 10,
    'Please enter a complete delivery address (at least 10 characters).'
  );
  if (!isAddressValid) isFormValid = false;

  return isFormValid;
}

// ==========================================
// 9. ORDER SUBMISSION (HTTP POST with JSON Handling)
// ==========================================
async function handleCheckoutSubmit(e) {
  e.preventDefault();

  if (state.cart.length === 0) {
    showToast('Cart is empty. Add food items to proceed.', 'info');
    closeCheckoutModal();
    return;
  }

  if (!validateCheckoutForm()) {
    showToast('Please fix the errors in the form.', 'info');
    return;
  }

  const totals = calculateCartTotals();
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'COD';

  // Construct structured order payload
  const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderDate = new Date();

  const orderPayload = {
    orderId,
    timestamp: orderDate.toISOString(),
    customer: {
      name: DOM.custName.value.trim(),
      phone: DOM.custPhone.value.trim(),
      address: DOM.custAddress.value.trim(),
      notes: DOM.custNotes.value.trim()
    },
    items: state.cart.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      itemTotal: Number((item.price * item.quantity).toFixed(2))
    })),
    pricing: {
      subtotal: Number(totals.subtotal.toFixed(2)),
      deliveryFee: Number(totals.deliveryFee.toFixed(2)),
      tax: Number(totals.tax.toFixed(2)),
      grandTotal: Number(totals.grandTotal.toFixed(2))
    },
    paymentMethod,
    status: 'Confirmed'
  };

  // UI Button spinner
  DOM.placeOrderBtn.disabled = true;
  DOM.placeOrderBtnText.textContent = 'Processing Order...';
  DOM.placeOrderSpinner.style.display = 'inline-block';

  let backendDispatchStatus = '';

  try {
    // Attempt HTTP POST request to API endpoint using Fetch API & async/await
    const response = await fetch(APP_CONFIG.ORDERS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      backendDispatchStatus = `HTTP 201 Created — Order saved to backend server: ${JSON.stringify(jsonResponse)}`;
    } else {
      backendDispatchStatus = `Backend responded with HTTP status ${response.status}. Client fallback enabled.`;
    }
  } catch (err) {
    // Expected in Program 1 since backend will be constructed in Program 3 & 4
    console.info('Backend server is not running (Normal for Program 1 - Client only):', err.message);
    backendDispatchStatus = 'HTTP POST attempted to backend. Processed in standalone simulation mode.';
  } finally {
    DOM.placeOrderBtn.disabled = false;
    DOM.placeOrderBtnText.textContent = 'Place Order & Pay';
    DOM.placeOrderSpinner.style.display = 'none';
  }

  // Complete Order
  state.currentOrder = orderPayload;
  state.orderStatusStep = 2; // Move to Preparing
  
  // Clear cart and form
  clearEntireCart();
  DOM.checkoutForm.reset();

  closeCheckoutModal();
  showOrderConfirmation(orderPayload, backendDispatchStatus);
}

// ==========================================
// 10. ORDER CONFIRMATION & LIVE ORDER TRACKER
// ==========================================
const STATUS_STEPS_CONFIG = [
  { step: 1, label: 'Order Received', badgeText: 'Received', badgeClass: 'status-confirmed', progress: 25 },
  { step: 2, label: 'Preparing Food', badgeText: 'Cooking in Kitchen', badgeClass: 'status-preparing', progress: 50 },
  { step: 3, label: 'Out for Delivery', badgeText: 'Rider on the Way', badgeClass: 'status-delivery', progress: 75 },
  { step: 4, label: 'Delivered', badgeText: 'Delivered Warm!', badgeClass: 'status-completed', progress: 100 }
];

function showOrderConfirmation(order, dispatchStatus) {
  if (!DOM.orderConfirmationModal) return;

  // Populate Order details
  if (DOM.confirmOrderId) DOM.confirmOrderId.textContent = `#${order.orderId}`;
  if (DOM.confirmOrderTime) {
    DOM.confirmOrderTime.textContent = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (DOM.confirmName) DOM.confirmName.textContent = order.customer.name;
  if (DOM.confirmPhone) DOM.confirmPhone.textContent = order.customer.phone;
  if (DOM.confirmAddress) DOM.confirmAddress.textContent = order.customer.address;
  
  const paymentLabels = {
    COD: '💵 Cash on Delivery',
    CARD: '💳 Credit / Debit Card (Simulated)',
    UPI: '📱 UPI / Net Banking (Simulated)'
  };
  if (DOM.confirmPayment) DOM.confirmPayment.textContent = paymentLabels[order.paymentMethod] || order.paymentMethod;

  // Itemized receipt
  if (DOM.confirmItemsList) {
    DOM.confirmItemsList.innerHTML = order.items.map(item => `
      <div class="checkout-item-line">
        <span>${item.quantity}x ${escapeHTML(item.name)}</span>
        <span>$${item.itemTotal.toFixed(2)}</span>
      </div>
    `).join('') + `
      <div class="checkout-item-line text-muted">
        <span>Delivery Fee:</span>
        <span>${order.pricing.deliveryFee === 0 ? 'FREE' : `$${order.pricing.deliveryFee.toFixed(2)}`}</span>
      </div>
      <div class="checkout-item-line text-muted">
        <span>Tax (5%):</span>
        <span>$${order.pricing.tax.toFixed(2)}</span>
      </div>
    `;
  }

  if (DOM.confirmTotalPaid) {
    DOM.confirmTotalPaid.textContent = `$${order.pricing.grandTotal.toFixed(2)}`;
  }

  if (DOM.httpPostStatusText) {
    DOM.httpPostStatusText.textContent = dispatchStatus;
  }

  // Update Status Steps
  updateStatusTrackerUI();

  DOM.orderConfirmationModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function updateStatusTrackerUI() {
  const currentStepNum = state.orderStatusStep;
  const currentConfig = STATUS_STEPS_CONFIG.find(s => s.step === currentStepNum) || STATUS_STEPS_CONFIG[0];

  // Badge & Progress Bar
  if (DOM.currentStatusBadge) {
    DOM.currentStatusBadge.className = `status-badge ${currentConfig.badgeClass}`;
    DOM.currentStatusBadge.textContent = currentConfig.badgeText;
  }

  if (DOM.statusProgressBar) {
    DOM.statusProgressBar.style.width = `${currentConfig.progress}%`;
  }

  // Step circles
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step-${i}`);
    if (stepEl) {
      if (i < currentStepNum) {
        stepEl.className = 'status-step active completed';
      } else if (i === currentStepNum) {
        stepEl.className = 'status-step active';
      } else {
        stepEl.className = 'status-step';
      }
    }
  }

  // Advance button label
  if (DOM.advanceStatusBtn) {
    if (currentStepNum >= 4) {
      DOM.advanceStatusBtn.textContent = '↺ Reset Tracking Demo';
    } else {
      DOM.advanceStatusBtn.textContent = `⏩ Next: ${STATUS_STEPS_CONFIG[currentStepNum].label}`;
    }
  }
}

function advanceOrderStatusDemo() {
  if (state.orderStatusStep >= 4) {
    state.orderStatusStep = 1;
    showToast('Reset order tracking demo', 'info');
  } else {
    state.orderStatusStep += 1;
    const config = STATUS_STEPS_CONFIG.find(s => s.step === state.orderStatusStep);
    showToast(`Order status updated: ${config.label}`, 'success');
  }
  updateStatusTrackerUI();
}

function closeOrderConfirmationModal() {
  if (DOM.orderConfirmationModal) {
    DOM.orderConfirmationModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  // Scroll to menu
  const menuEl = document.getElementById('menu');
  if (menuEl) {
    menuEl.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==========================================
// 11. TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease-out forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

// ==========================================
// 12. UTILITY FUNCTIONS
// ==========================================
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ==========================================
// 13. EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
  // 1. Search Bar input
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      if (DOM.clearSearchBtn) {
        DOM.clearSearchBtn.style.display = state.searchQuery ? 'flex' : 'none';
      }
      applyFiltersAndRender();
    });
  }

  // Clear search button
  if (DOM.clearSearchBtn) {
    DOM.clearSearchBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      state.searchQuery = '';
      DOM.clearSearchBtn.style.display = 'none';
      DOM.searchInput.focus();
      applyFiltersAndRender();
    });
  }

  // 2. Category Dropdown
  if (DOM.categoryFilter) {
    DOM.categoryFilter.addEventListener('change', e => {
      state.selectedCategory = e.target.value;
      syncCategoryPills(state.selectedCategory);
      applyFiltersAndRender();
    });
  }

  // Category Quick Filter Pills
  if (DOM.categoryPills) {
    DOM.categoryPills.addEventListener('click', e => {
      const pill = e.target.closest('.pill-btn');
      if (!pill) return;

      const category = pill.dataset.category;
      state.selectedCategory = category;

      if (DOM.categoryFilter) {
        DOM.categoryFilter.value = category;
      }

      syncCategoryPills(category);
      applyFiltersAndRender();
    });
  }

  // 3. Sort Select
  if (DOM.sortSelect) {
    DOM.sortSelect.addEventListener('change', e => {
      state.selectedSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  // 4. Reset Filters Buttons
  if (DOM.resetFiltersBtn) {
    DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);
  }
  if (DOM.emptyResetBtn) {
    DOM.emptyResetBtn.addEventListener('click', resetAllFilters);
  }

  // 5. Food Catalog Grid Click Delegation (Add to cart)
  if (DOM.foodContainer) {
    DOM.foodContainer.addEventListener('click', e => {
      const addBtn = e.target.closest('[data-action="add-to-cart"]');
      if (addBtn) {
        const id = addBtn.dataset.id;
        addToCart(id);
      }
    });
  }

  // 6. Cart Drawer Toggles
  if (DOM.cartToggleBtn) DOM.cartToggleBtn.addEventListener('click', openCartDrawer);
  if (DOM.heroViewCartBtn) DOM.heroViewCartBtn.addEventListener('click', openCartDrawer);
  if (DOM.closeCartBtn) DOM.closeCartBtn.addEventListener('click', closeCartDrawer);
  if (DOM.cartBackdrop) DOM.cartBackdrop.addEventListener('click', closeCartDrawer);
  if (DOM.cartBrowseBtn) DOM.cartBrowseBtn.addEventListener('click', closeCartDrawer);

  // 7. Cart Drawer Item Actions Delegation (Quantity + / -, Remove)
  if (DOM.cartItemsList) {
    DOM.cartItemsList.addEventListener('click', e => {
      const incBtn = e.target.closest('[data-action="qty-increase"]');
      const decBtn = e.target.closest('[data-action="qty-decrease"]');
      const removeBtn = e.target.closest('[data-action="remove-item"]');

      if (incBtn) {
        updateCartQuantity(incBtn.dataset.id, 1);
      } else if (decBtn) {
        updateCartQuantity(decBtn.dataset.id, -1);
      } else if (removeBtn) {
        removeFromCart(removeBtn.dataset.id);
      }
    });
  }

  // 8. Clear Cart Button
  if (DOM.clearCartBtn) {
    DOM.clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to remove all items from your cart?')) {
        clearEntireCart();
      }
    });
  }

  // 9. Proceed to Checkout
  if (DOM.proceedCheckoutBtn) {
    DOM.proceedCheckoutBtn.addEventListener('click', openCheckoutModal);
  }

  // 10. Checkout Modal Controls
  if (DOM.closeCheckoutBtn) DOM.closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  if (DOM.cancelCheckoutBtn) {
    DOM.cancelCheckoutBtn.addEventListener('click', () => {
      closeCheckoutModal();
      openCartDrawer();
    });
  }
  if (DOM.checkoutBackdrop) {
    DOM.checkoutBackdrop.addEventListener('click', e => {
      if (e.target === DOM.checkoutBackdrop) closeCheckoutModal();
    });
  }

  // Checkout Form Submission
  if (DOM.checkoutForm) {
    DOM.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Live Inline Validation on Blur / Input
  if (DOM.custName) {
    DOM.custName.addEventListener('input', () => {
      if (DOM.custName.classList.contains('is-invalid')) {
        validateField(
          DOM.custName,
          DOM.nameError,
          val => val.length >= 2 && /^[a-zA-Z\s.'-]+$/.test(val),
          'Please enter a valid full name.'
        );
      }
    });
  }
  if (DOM.custPhone) {
    DOM.custPhone.addEventListener('input', () => {
      if (DOM.custPhone.classList.contains('is-invalid')) {
        validateField(
          DOM.custPhone,
          DOM.phoneError,
          val => val.replace(/\D/g, '').length === 10,
          'Please enter a valid 10-digit phone number.'
        );
      }
    });
  }
  if (DOM.custAddress) {
    DOM.custAddress.addEventListener('input', () => {
      if (DOM.custAddress.classList.contains('is-invalid')) {
        validateField(
          DOM.custAddress,
          DOM.addressError,
          val => val.length >= 10,
          'Please enter at least 10 characters for your address.'
        );
      }
    });
  }

  // 11. Order Confirmation Modal Controls
  if (DOM.closeConfirmBtn) DOM.closeConfirmBtn.addEventListener('click', closeOrderConfirmationModal);
  if (DOM.orderAnotherBtn) DOM.orderAnotherBtn.addEventListener('click', closeOrderConfirmationModal);
  if (DOM.advanceStatusBtn) DOM.advanceStatusBtn.addEventListener('click', advanceOrderStatusDemo);
  if (DOM.orderConfirmationModal) {
    DOM.orderConfirmationModal.addEventListener('click', e => {
      if (e.target === DOM.orderConfirmationModal) closeOrderConfirmationModal();
    });
  }

  // 12. Retry Fetch Button
  if (DOM.retryFetchBtn) {
    DOM.retryFetchBtn.addEventListener('click', fetchFoodCatalog);
  }

  // Escape key closes modals/drawers
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (DOM.cartDrawer && DOM.cartDrawer.classList.contains('open')) {
        closeCartDrawer();
      } else if (DOM.checkoutBackdrop && DOM.checkoutBackdrop.style.display === 'flex') {
        closeCheckoutModal();
      } else if (DOM.orderConfirmationModal && DOM.orderConfirmationModal.style.display === 'flex') {
        closeOrderConfirmationModal();
      }
    }
  });
}

function syncCategoryPills(activeCategory) {
  if (!DOM.categoryPills) return;
  const pills = DOM.categoryPills.querySelectorAll('.pill-btn');
  pills.forEach(pill => {
    if (pill.dataset.category.toLowerCase() === activeCategory.toLowerCase()) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

function resetAllFilters() {
  state.searchQuery = '';
  state.selectedCategory = 'all';
  state.selectedSort = 'default';

  if (DOM.searchInput) DOM.searchInput.value = '';
  if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = 'none';
  if (DOM.categoryFilter) DOM.categoryFilter.value = 'all';
  if (DOM.sortSelect) DOM.sortSelect.value = 'default';
  syncCategoryPills('all');

  applyFiltersAndRender();
  showToast('Filters reset', 'info');
}

// ==========================================
// 14. APPLICATION INITIALIZATION
// ==========================================
function initApp() {
  initDOMElements();
  setupEventListeners();
  loadCartFromStorage();
  updateCartUI();
  fetchFoodCatalog();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for node/testing environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    state,
    APP_CONFIG,
    calculateCartTotals,
    getFilteredAndSortedFoods,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearEntireCart
  };
}
