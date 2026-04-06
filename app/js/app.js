/* ============================================
   KitchenSync - Main JavaScript
   Handles interactivity and user flows
   ============================================ */

// ---- Wait for the page to fully load before running scripts ----
document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // 1. FILTER TABS (Dashboard page)
  // ============================================
  var filterTabs = document.querySelectorAll('.filter-tab');
  var filterSections = document.querySelectorAll('.filter-content');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {

      // Remove all active classes from every tab
      filterTabs.forEach(function (t) {
        t.classList.remove('active', 'active-orange', 'active-yellow', 'active-blue');
      });

      // Figure out which color class this tab should use
      var filterType = this.getAttribute('data-filter');

      if (filterType === 'expired') {
        this.classList.add('active');       // red underline
      } else if (filterType === 'expiring') {
        this.classList.add('active-orange'); // orange underline
      } else if (filterType === 'low-stock') {
        this.classList.add('active-yellow'); // yellow/orange underline
      } else {
        this.classList.add('active');        // default red for "All"
      }

      // Show/hide the matching content sections
      filterSections.forEach(function (section) {
        if (section.getAttribute('data-content') === filterType) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });

    });
  });

  // ============================================
  // 2. QUANTITY CONTROLS (Add Item page)
  // ============================================
  var minusBtn = document.getElementById('quantityMinus');
  var plusBtn = document.getElementById('quantityPlus');
  var quantityInput = document.getElementById('quantityValue');

  if (minusBtn && plusBtn && quantityInput) {
    minusBtn.addEventListener('click', function () {
      var currentVal = parseInt(quantityInput.value);
      if (currentVal > 1) {
        quantityInput.value = currentVal - 1;
      }
    });

    plusBtn.addEventListener('click', function () {
      var currentVal = parseInt(quantityInput.value);
      quantityInput.value = currentVal + 1;
    });
  }

  // ============================================
  // 3. ASSIGN-TO BUTTONS (Add Item page)
  // ============================================
  var assignBtns = document.querySelectorAll('.assign-btn');

  assignBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Remove active class from all assign buttons
      assignBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      // Add active class to the clicked button
      this.classList.add('active');
    });
  });

  // ============================================
  // 4. ADD ITEM FORM SUBMISSION (Add Item page)
  // ============================================
  var addItemForm = document.getElementById('addItemForm');

  if (addItemForm) {
    addItemForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Stop the form from actually submitting

      var itemName = document.getElementById('itemName').value;
      var quantity = document.getElementById('quantityValue').value;
      var expiryDate = document.getElementById('expiryDate').value;

      // Find which storage location is selected
      var selectedStorage = 'None';
      assignBtns.forEach(function (btn) {
        if (btn.classList.contains('active')) {
          selectedStorage = btn.textContent;
        }
      });

      // For now, just show an alert. Later this will connect to the backend.
      alert(
        'Item Added!\n\n' +
        'Name: ' + itemName + '\n' +
        'Quantity: ' + quantity + '\n' +
        'Storage: ' + selectedStorage + '\n' +
        'Expiry Date: ' + expiryDate
      );

      // Reset the form
      addItemForm.reset();
      document.getElementById('quantityValue').value = '1';
      assignBtns.forEach(function (b) {
        b.classList.remove('active');
      });
    });
  }

  // ============================================
  // 5. SEARCH FILTERING (Storage & Recipe pages)
  // ============================================
  var pageSearchInputs = document.querySelectorAll('.page-search-input');

  pageSearchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      var searchTerm = this.value.toLowerCase();
      var targetList = this.getAttribute('data-target');
      var items = document.querySelectorAll(targetList + ' .searchable-item');

      items.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ============================================
  // 6. SIGN IN FORM (Login page)
  // ============================================
  var loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = document.getElementById('loginEmail').value;
      var password = document.getElementById('loginPassword').value;

      if (email && password) {
        // For now, just redirect to the dashboard
        window.location.href = 'dashboard.html';
      } else {
        alert('Please enter your email and password.');
      }
    });
  }

});
