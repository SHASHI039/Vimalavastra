// ── PRODUCT DATA ──
const PRODUCTS = [
  { id: 1, name: "Royal Maroon Banarasi Silk Saree", category: "sarees", fabric: "Banarasi Silk", price: 8499, oldPrice: 12000, image: "images/saree1.png", rating: 4.8, reviews: 142, badge: "bestseller", colors: ["#7B1826","#1a237e","#1b5e20"], desc: "Exquisite Banarasi silk saree with intricate gold zari work and a stunning contrast border. Perfect for weddings and grand celebrations.", occasion: "Wedding" },
  { id: 2, name: "Sapphire Blue Kanjivaram Saree", category: "sarees", fabric: "Kanjivaram Silk", price: 10999, oldPrice: 15000, image: "images/saree2.png", rating: 4.9, reviews: 89, badge: "new", colors: ["#1a237e","#7B1826","#4a148c"], desc: "Classic Kanjivaram silk saree in royal blue with traditional golden border. A timeless piece for connoisseurs of fine silk.", occasion: "Festival" },
  { id: 3, name: "Pink Chanderi Silk Saree", category: "sarees", fabric: "Chanderi Silk", price: 5999, oldPrice: 8000, image: "images/saree3.png", rating: 4.7, reviews: 203, badge: "sale", colors: ["#e91e8c","#f48fb1","#ce93d8"], desc: "Lightweight Chanderi silk saree in pastel pink with delicate golden threadwork. Elegant choice for festive occasions.", occasion: "Festival" },
  { id: 4, name: "Green Zari Chanderi Saree", category: "sarees", fabric: "Chanderi", price: 4999, oldPrice: 7000, image: "images/saree4.png", rating: 4.6, reviews: 67, badge: null, colors: ["#1b5e20","#388e3c","#a5d6a7"], desc: "Beautiful green Chanderi saree with silver zari border. Perfect for daytime ceremonies and casual festive gatherings.", occasion: "Casual" },
  { id: 5, name: "Crimson Bridal Lehenga Choli", category: "dresses", fabric: "Heavy Silk", price: 18999, oldPrice: 28000, image: "images/dress1.png", rating: 4.9, reviews: 55, badge: "bestseller", colors: ["#c62828","#880e4f","#6a1b9a"], desc: "Stunning deep red bridal lehenga with heavy embroidery and intricate mirror work. A dream outfit for the modern Indian bride.", occasion: "Bridal" },
  { id: 6, name: "Purple Anarkali Suit", category: "dresses", fabric: "Georgette", price: 6499, oldPrice: 9000, image: "images/dress2.png", rating: 4.7, reviews: 118, badge: "new", colors: ["#4a148c","#880e4f","#1a237e"], desc: "Flowing purple Anarkali suit with golden embroidery panels and a beautiful dupatta. Perfect for festive gatherings and occasions.", occasion: "Festival" },
];

window.PRODUCTS = PRODUCTS;

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for(let i = 0; i < full; i++) s += '★';
  if(half) s += '½';
  while(s.replace('½','').length + (half?1:0) < 5) s += '☆';
  return s;
}

function formatPrice(p) { return '₹' + p.toLocaleString('en-IN'); }

function createProductCard(p) {
  const badgeHtml = p.badge ? `<span class="product-badge ${p.badge === 'new' ? 'new' : p.badge === 'sale' ? 'sale' : ''}">${p.badge === 'bestseller' ? '🔥 Bestseller' : p.badge.toUpperCase()}</span>` : '';
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-img">
      ${badgeHtml}
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <button class="wishlist-btn ${isWishlisted(p.id) ? 'active' : ''}" onclick="toggleWishlist(${p.id}, this)" title="Add to Wishlist">
        ${isWishlisted(p.id) ? '❤️' : '🤍'}
      </button>
    </div>
    <div class="product-info">
      <div class="category">${p.fabric}</div>
      <h3><a href="product.html?id=${p.id}" style="text-decoration:none;color:inherit;">${p.name}</a></h3>
      <div class="rating">
        <span class="stars">${renderStars(p.rating)}</span>
        <span>(${p.reviews})</span>
      </div>
      <div class="price-row">
        <div>
          <span class="price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
        </div>
        <button class="add-cart-btn" onclick="addToCart(${p.id})">+ Cart</button>
      </div>
    </div>
  </div>`;
}

// Wishlist
function getWishlist() { return JSON.parse(localStorage.getItem('vv_wishlist') || '[]'); }
function saveWishlist(w) { localStorage.setItem('vv_wishlist', JSON.stringify(w)); }
function isWishlisted(id) { return getWishlist().includes(id); }
function toggleWishlist(id, btn) {
  let w = getWishlist();
  if(w.includes(id)) {
    w = w.filter(x => x !== id);
    if(btn) { btn.textContent = '🤍'; btn.classList.remove('active'); }
    showToast('Removed from wishlist');
  } else {
    w.push(id);
    if(btn) { btn.textContent = '❤️'; btn.classList.add('active'); }
    showToast('Added to wishlist ❤️');
  }
  saveWishlist(w);
  updateCartBadges();
}

// Toast
function showToast(msg) {
  let t = document.getElementById('toast');
  if(!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = `<span>✓</span> ${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Cart
function getCart() { return JSON.parse(localStorage.getItem('vv_cart') || '[]'); }
function saveCart(c) { localStorage.setItem('vv_cart', JSON.stringify(c)); }

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  let cart = getCart();
  const ex = cart.find(x => x.id === id);
  if(ex) { ex.qty++; } else { cart.push({ id, qty: 1 }); }
  saveCart(cart);
  updateCartBadges();
  showToast(`${p.name} added to cart 🛒`);
}

function updateCartBadges() {
  const cart = getCart();
  const wishlist = getWishlist();
  const totalQty = cart.reduce((a,c) => a + c.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => el.textContent = totalQty || '');
  document.querySelectorAll('.wishlist-badge').forEach(el => el.textContent = wishlist.length || '');
}

// Search
function handleSearch(e) {
  e.preventDefault();
  const q = e.target.querySelector('input').value.trim();
  if(q) window.location.href = `sarees.html?search=${encodeURIComponent(q)}`;
}

// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
  const ham = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-menu');
  if(ham && menu) {
    ham.addEventListener('click', () => menu.classList.toggle('open'));
  }
  const searchForms = document.querySelectorAll('.search-form');
  searchForms.forEach(f => f.addEventListener('submit', handleSearch));
});
