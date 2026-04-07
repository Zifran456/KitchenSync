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


});
document.addEventListener('DOMContentLoaded', function () {

  fetch("/dashboard-summary")
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalItems").textContent = data.totalItems;
      document.getElementById("expiredItems").textContent = data.expiredItems;
      document.getElementById("expiringSoonItems").textContent = data.expiringSoonItems;
      document.getElementById("lowStockItems").textContent = data.lowStockItems;
    })
    .catch(err => console.error("Dashboard error:", err));

});

if (document.getElementById("recipeSuggestionsGrid")) {
  fetch("/api/recipes/expiring-soon")
    .then(res => res.json())
    .then(meals => {
      renderRecipeSuggestions(meals);
    })
    .catch(err => console.error("Recipe error:", err));
}



const itemNameInput = document.getElementById("itemName");
const imagePreview = document.getElementById("imagePreview");
const imageUrlInput = document.getElementById("imageUrl");
const assignBtns = document.querySelectorAll(".assign-btn");
const storageInput = document.getElementById("storageValue");

if (assignBtns.length && storageInput) {
  assignBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      assignBtns.forEach(function (b) {
        b.classList.remove("active");
      });

      this.classList.add("active");
      storageInput.value = this.textContent.trim().toLowerCase();
    });
  });
}

if (itemNameInput && imagePreview && imageUrlInput) {
  let imageTimer;

  itemNameInput.addEventListener("input", function () {
    const itemName = this.value.trim();

    clearTimeout(imageTimer);

    if (!itemName) {
      imagePreview.innerHTML = `<i class="bi bi-image"></i>`;
      imageUrlInput.value = "";
      return;
    }

    imageTimer = setTimeout(() => {

      const imageUrl = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(itemName.toLowerCase())}.png`;

      imagePreview.innerHTML = `
       <img src="${imageUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" onerror="this.style.border='3px solid red'">`;

      imageUrlInput.value = imageUrl;

    }, 300);
  });
}


if (assignBtns.length && storageInput) {
  assignBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      assignBtns.forEach(function (b) {
        b.classList.remove("active");
      });

      this.classList.add("active");
      storageInput.value = this.textContent.trim().toLowerCase();
    });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const recipeGrid = document.getElementById("recipeSuggestionsGrid");

  if (!recipeGrid) return;

  fetch("/api/recipes/expiring-soon")
    .then(res => res.json())
    .then(meals => {
      recipeGrid.innerHTML = "";

      if (!meals || meals.length === 0) {
        recipeGrid.innerHTML = "<p>No recipe suggestions right now.</p>";
        return;
      }

      meals.slice(0, 3).forEach(meal => {
        recipeGrid.innerHTML += `
    <a href="/recipe-suggestions" style="text-decoration:none; color:inherit;">
      <div class="recipe-thumb" style="min-width:120px;">
        <img 
          src="${meal.strMealThumb}" 
          alt="${meal.strMeal}"
          style="width:100%; height:100px; object-fit:cover; border-radius:12px;"
        >
        
      </div>
    </a>
  `;
      });
    })
    .catch(err => {
      console.error("Recipe error:", err);
      recipeGrid.innerHTML = "<p>Could not load recipes.</p>";
    });
});
