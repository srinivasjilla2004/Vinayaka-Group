/**
 * Gopuram Pooja Stores - Official PDF Catalogue Engine
 * Sourced directly from Y.V.S. Gopuram Pooja Stores Official Catalogue PDF (Pages 5-48)
 * Strict Zero Price Policy: Only product photos, titles, codes, and packing details.
 */

let currentCategory = 'all';
let currentSearchTerm = '';
let visibleCount = 24;
const BATCH_SIZE = 24;

function getCatalogData() {
  if (typeof window !== 'undefined' && Array.isArray(window.GOPURAM_PDF_CATALOG)) {
    return window.GOPURAM_PDF_CATALOG;
  }
  return [];
}

function renderCatalog() {
  const container = document.getElementById('gopuramProductsContainer');
  const countEl = document.getElementById('catalogCount');
  const loadMoreBtn = document.getElementById('btnLoadMore');
  if (!container) return;

  const allItems = getCatalogData();
  const term = currentSearchTerm.toLowerCase().trim();

  const filtered = allItems.filter(p => {
    // Category match
    let matchesCat = false;
    if (currentCategory === 'all') {
      matchesCat = true;
    } else if (currentCategory === 'ritual') {
      matchesCat = p.category === 'ritual' || p.category === 'malas';
    } else {
      matchesCat = p.category === currentCategory;
    }

    // Search match
    if (!matchesCat) return false;
    if (!term) return true;

    const name = (p.name || '').toLowerCase();
    const code = (p.code || '').toLowerCase();
    const packing = (p.packing || '').toLowerCase();
    const catName = (p.categoryName || '').toLowerCase();
    return name.includes(term) || code.includes(term) || packing.includes(term) || catName.includes(term);
  });

  if (countEl) {
    countEl.textContent = `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length} products`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fffbeb; border: 1px dashed #fde68a; border-radius: 16px;">
        <div style="margin-bottom: 14px;"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c.5 2.5 3 4.5 3 7a3 3 0 0 1-6 0c0-2.5 2.5-4.5 3-7z"/><path d="M5 14c0 3 3 5 7 5s7-2 7-5H5z"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg></div>
        <h4 style="font-size: 20px; font-weight: 800; color: #78350f; margin-bottom: 8px;">No matching pooja products found</h4>
        <p style="color: #92400e; font-size: 14px; margin-bottom: 16px;">Try adjusting your search terms or select "All Products" to browse the complete 228-item catalogue.</p>
        <button class="filter-btn active" style="background: #b91c1c; color: #fff;" onclick="resetCatalogFilters()">Reset Filters</button>
      </div>
    `;
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  const toShow = filtered.slice(0, visibleCount);

  container.innerHTML = toShow.map(p => {
    const escapedName = escapeJs(p.name);
    const escapedCode = escapeJs(p.code);
    const escapedPacking = escapeJs(p.packing);
    const imgSrc = p.image || '';

    return `
      <div class="product-card reveal active" data-category="${p.category}" id="product-${p.id}">
        <div class="product-media" onclick="openProductImageModal('${imgSrc}', '${escapedName}', '${escapedCode}')" title="Click to view full photo">
          <img src="${imgSrc}" alt="${escapedName}" loading="lazy" onerror="this.onerror=null; this.src='assets/images/gopuram_logo.png';">
          <div class="product-zoom-btn" title="Zoom product image"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
        </div>
        <div class="product-body">
          <div class="product-meta-row">
            <span class="product-tag">${p.categoryName || 'Devotional'}</span>
            ${p.code ? `<span class="product-code-badge">${escapeHtml(p.code)}</span>` : ''}
          </div>
          <h3 class="product-title">${escapeHtml(p.name)}</h3>
          ${p.packing ? `<div class="product-packing-badge"><strong>Std Packing:</strong> ${escapeHtml(p.packing)}</div>` : ''}
          <div class="product-actions">
            <button class="btn-order-wa" onclick="orderWhatsAppCatalogProduct('${escapedName}', '${escapedCode}', '${escapedPacking}')">
              <svg style="width: 16px; height: 16px; fill: currentColor;" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              Enquire on WhatsApp
            </button>
            <button class="btn-catalog-wa" onclick="openProductImageModal('${imgSrc}', '${escapedName}', '${escapedCode}')">
              View Product Photo
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (loadMoreBtn) {
    if (visibleCount < filtered.length) {
      loadMoreBtn.style.display = 'inline-flex';
      loadMoreBtn.textContent = `Load More Products (${filtered.length - visibleCount} remaining)`;
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function escapeJs(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function filterCatalogTab(slug, btnEl) {
  currentCategory = slug;
  visibleCount = BATCH_SIZE;

  const buttons = document.querySelectorAll('#gopuramFilters .filter-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  }

  renderCatalog();
}

function handleCatalogSearch(inputEl) {
  currentSearchTerm = inputEl.value || '';
  visibleCount = BATCH_SIZE;
  renderCatalog();
}

function loadMoreCatalog() {
  visibleCount += BATCH_SIZE;
  renderCatalog();
}

function resetCatalogFilters() {
  currentCategory = 'all';
  currentSearchTerm = '';
  visibleCount = BATCH_SIZE;

  const searchInput = document.getElementById('catalogSearch');
  if (searchInput) searchInput.value = '';

  const buttons = document.querySelectorAll('#gopuramFilters .filter-btn');
  buttons.forEach((b, idx) => {
    b.classList.toggle('active', idx === 0);
  });

  renderCatalog();
}

function orderWhatsAppCatalogProduct(title, code, packing) {
  let message = `Hello Gopuram Pooja Store, I would like to enquire about / order "${title}"`;
  if (code) message += ` (${code})`;
  if (packing) message += ` [${packing}]`;
  message += ` from your official catalogue. Please share wholesale / retail details.`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/919281434830?text=${encoded}`, '_blank');
}

/* Product Zoom / Preview Modal */
function openProductImageModal(src, title, code) {
  let modal = document.getElementById('productImageModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'productImageModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box" style="max-width: 580px; text-align: center; padding: 24px;">
        <button class="modal-close" onclick="closeProductImageModal()" aria-label="Close modal"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        <div style="background: #ffffff; border-radius: 12px; padding: 18px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
          <img id="modalPreviewImg" src="" alt="Product Photo" style="max-width: 100%; max-height: 380px; object-fit: contain; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));">
        </div>
        <h3 id="modalPreviewTitle" style="font-size: 19px; font-weight: 850; color: #0f172a; margin-bottom: 6px;"></h3>
        <p id="modalPreviewCode" style="font-size: 13px; font-weight: 700; color: #b91c1c; margin-bottom: 20px;"></p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button id="modalPreviewWaBtn" class="btn-order-wa" style="padding: 12px 24px;">
            Enquire on WhatsApp
          </button>
          <button class="btn-slide-secondary" style="padding: 12px 20px;" onclick="closeProductImageModal()">
            Close
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProductImageModal();
    });
  }

  const imgEl = document.getElementById('modalPreviewImg');
  const titleEl = document.getElementById('modalPreviewTitle');
  const codeEl = document.getElementById('modalPreviewCode');
  const waBtn = document.getElementById('modalPreviewWaBtn');

  if (imgEl) imgEl.src = src;
  if (titleEl) titleEl.textContent = title;
  if (codeEl) codeEl.textContent = code ? code : '';
  if (waBtn) {
    waBtn.onclick = () => orderWhatsAppCatalogProduct(title, code, '');
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductImageModal() {
  const modal = document.getElementById('productImageModal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gopuramProductsContainer')) {
    renderCatalog();
  }
});
