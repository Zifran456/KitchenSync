/* ============================================
   KitchenSync - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // 1. FILTER TABS (Dashboard page)
  // ============================================
  var filterTabs     = document.querySelectorAll('.filter-tab');
  var filterSections = document.querySelectorAll('.filter-content');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) {
        t.classList.remove('active', 'active-orange', 'active-yellow', 'active-blue');
      });

      var filterType = this.getAttribute('data-filter');
      if      (filterType === 'expired')   this.classList.add('active');
      else if (filterType === 'expiring')  this.classList.add('active-orange');
      else if (filterType === 'low-stock') this.classList.add('active-yellow');
      else                                 this.classList.add('active');

      filterSections.forEach(function (section) {
        section.style.display =
          section.getAttribute('data-content') === filterType ? 'block' : 'none';
      });
    });
  });

  // ============================================
  // 2. QUANTITY CONTROLS (Add Item page)
  // ============================================
  var minusBtn      = document.getElementById('quantityMinus');
  var plusBtn       = document.getElementById('quantityPlus');
  var quantityInput = document.getElementById('quantityValue');

  if (minusBtn && plusBtn && quantityInput) {
    minusBtn.addEventListener('click', function () {
      var val = parseInt(quantityInput.value);
      if (val > 1) quantityInput.value = val - 1;
    });
    plusBtn.addEventListener('click', function () {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });
  }

  // ============================================
  // 3. ASSIGN-TO BUTTONS (Add Item page)
  //    Also keeps a hidden <input name="storage"> in sync
  // ============================================
  var assignBtns    = document.querySelectorAll('.assign-btn');
  var storageHidden = document.getElementById('storageValue');

  assignBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      assignBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      if (storageHidden) storageHidden.value = this.textContent.trim();
    });
  });

  // ============================================
  // 4. EXPIRY DATE — placeholder colour
  // ============================================
  var expiryDate = document.getElementById('expiryDate');

  if (expiryDate) {
    expiryDate.addEventListener('change', function () {
      this.classList.toggle('date-empty', !this.value);
    });
  }

  // ============================================
  // 5. SEARCH FILTERING (Storage & Recipe pages)
  // ============================================
  var pageSearchInputs = document.querySelectorAll('.page-search-input');

  pageSearchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      var term   = this.value.toLowerCase();
      var target = this.getAttribute('data-target');
      var items  = document.querySelectorAll(target + ' .searchable-item');

      items.forEach(function (item) {
        item.style.display = item.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  });

  // ============================================
  // 6. RECIPE DETAIL MODAL
  //    Populated from urgentRecipes / regularRecipes / likedRecipesData
  //    injected by the EJS templates.
  // ============================================
  var modal        = document.getElementById('recipeModal');
  var learnBtns    = document.querySelectorAll('.btn-learn-more');

  if (modal && learnBtns.length > 0) {
    var bsModal = new bootstrap.Modal(modal);

    learnBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx   = this.getAttribute('data-recipe-index');
        var recipe;

        // recipes.ejs uses 'u0', 'u1' for urgent and 'r0', 'r1' for regular
        if (typeof urgentRecipes !== 'undefined' && idx && idx[0] === 'u') {
          recipe = urgentRecipes[parseInt(idx.slice(1))];
        } else if (typeof regularRecipes !== 'undefined' && idx && idx[0] === 'r') {
          recipe = regularRecipes[parseInt(idx.slice(1))];
        } else if (typeof likedRecipesData !== 'undefined') {
          // liked-recipes.ejs uses plain numeric index
          recipe = likedRecipesData[parseInt(idx)];
        }

        if (!recipe) return;

        document.getElementById('recipeModalLabel').textContent  = recipe.name;
        document.getElementById('modalDescription').textContent  = recipe.description;

        // Matched items chips
        var matchedDiv = document.getElementById('modalMatchedItems');
        matchedDiv.innerHTML = '';
        if (recipe.matchedItems && recipe.matchedItems.length > 0) {
          var label = document.createElement('p');
          label.style.cssText = 'font-size:0.8rem; font-weight:600; margin-bottom:0.4rem; color:#444;';
          label.textContent = 'You have these ingredients:';
          matchedDiv.appendChild(label);
          recipe.matchedItems.forEach(function (item) {
            var chip = document.createElement('span');
            var bg, color, border;
            if (item.status === 'expired') {
              bg = '#FDECEA'; color = '#E74C3C'; border = '#FBCBC8';
            } else if (item.status === 'expiring') {
              bg = '#FEF3E2'; color = '#B7600A'; border = '#F9D89A';
            } else {
              bg = '#EAF4EB'; color = '#2E7D32'; border = '#A8D5AB';
            }
            chip.style.cssText = 'display:inline-block; border-radius:20px; font-size:0.72rem; padding:2px 8px; margin:2px 2px 0 0; font-weight:500; background:' + bg + '; color:' + color + '; border:1px solid ' + border + ';';
            chip.textContent = item.name;
            matchedDiv.appendChild(chip);
          });
        }

        // Ingredients list
        var ul = document.getElementById('modalIngredients');
        ul.innerHTML = '';
        (recipe.ingredients || []).forEach(function (ing) {
          var li = document.createElement('li');
          li.textContent = ing;
          ul.appendChild(li);
        });

        // Steps list
        var ol = document.getElementById('modalSteps');
        ol.innerHTML = '';
        (recipe.steps || []).forEach(function (step) {
          var li = document.createElement('li');
          li.textContent = step;
          ol.appendChild(li);
        });

        bsModal.show();
      });
    });
  }

  // ============================================
  // 7. NOTIFICATION BELL toggle
  // ============================================
  var notifBell  = document.getElementById('notifBell');
  var notifPanel = document.getElementById('notifPanel');

  if (notifBell && notifPanel) {
    notifBell.addEventListener('click', function (e) {
      e.stopPropagation();
      notifPanel.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!notifPanel.contains(e.target) && e.target !== notifBell) {
        notifPanel.classList.remove('open');
      }
    });
  }

  // ============================================
  // 8. LIKE / UNLIKE RECIPES (fetch, no page reload)
  // ============================================
  var likeBtns = document.querySelectorAll('.like-btn');

  likeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var recipeId = this.getAttribute('data-recipe-id');
      var isLiked  = this.classList.contains('liked');
      var icon     = this.querySelector('i');
      var self     = this;

      var method = isLiked ? 'DELETE' : 'POST';

      fetch('/recipes/' + recipeId + '/like', { method: method })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.liked) {
            self.classList.add('liked');
            self.style.color = 'var(--red-expired)';
            self.title = 'Remove from liked';
            icon.className = 'bi bi-heart-fill';
          } else {
            self.classList.remove('liked');
            self.style.color = '#CCC';
            self.title = 'Save recipe';
            icon.className = 'bi bi-heart';
          }
        })
        .catch(function (err) { console.error('Like toggle failed:', err); });
    });
  });

});
