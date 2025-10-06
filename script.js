/* ------------- DATA: sample dresses ------------- */
const PRODUCTS = [
  {
    id: 1,
    title: "Floral A-line Midi Dress",
    brand: "SatinBloom",
    price: 1499,
    mrp: 2499,
    rating: 4.6,
    category: "dress",
    gender: "women",
    colors: [
      {name:"Peach", code:"#ffb3a7", img:"https://picsum.photos/id/1005/800/1000"},
      {name:"Blue", code:"#9ad0ff", img:"https://picsum.photos/id/1011/800/1000"}
    ],
    sizes: ["XS","S","M","L","XL"],
    images: [
      "https://picsum.photos/id/1005/800/1000",
      "https://picsum.photos/id/1011/800/1000",
      "https://picsum.photos/id/1012/800/1000"
    ],
    desc: "A comfortable A-line dress in breathable fabric with beautiful floral print. Perfect for casual outings and brunch."
  },
  {
    id: 2,
    title: "Embroidered Anarkali Kurta",
    brand: "HeritageWeave",
    price: 2199,
    mrp: 2999,
    rating: 4.8,
    category: "kurta",
    gender: "women",
    colors: [
      {name:"Ivory", code:"#fff6ea", img:"https://picsum.photos/id/1025/800/1000"},
      {name:"Maroon", code:"#8b2f2f", img:"https://picsum.photos/id/1035/800/1000"}
    ],
    sizes: ["S","M","L"],
    images: [
      "https://picsum.photos/id/1025/800/1000",
      "https://picsum.photos/id/1035/800/1000"
    ],
    desc: "Traditional Anarkali with delicate embroidery and flowy silhouette. Ideal for festive occasions."
  },
  {
    id: 3,
    title: "Casual Wrap Dress",
    brand: "UrbanDrift",
    price: 999,
    mrp: 1399,
    rating: 4.2,
    category: "dress",
    gender: "women",
    colors: [
      {name:"Green", code:"#86efac", img:"https://picsum.photos/id/1047/800/1000"},
      {name:"Black", code:"#000000", img:"https://picsum.photos/id/1052/800/1000"}
    ],
    sizes: ["S","M","L","XL"],
    images: [
      "https://picsum.photos/id/1047/800/1000",
      "https://picsum.photos/id/1052/800/1000"
    ],
    desc: "Easy wrap dress for daily comfort. Lightweight and flattering fit."
  },
  {
    id: 4,
    title: "Polka Dot Mini Dress",
    brand: "RetroMuse",
    price: 1299,
    mrp: 1799,
    rating: 4.4,
    category: "dress",
    gender: "women",
    colors: [
      {name:"Red", code:"#ff5c5c", img:"https://picsum.photos/id/1060/800/1000"}
    ],
    sizes: ["XS","S","M","L"],
    images: [
      "https://picsum.photos/id/1060/800/1000",
      "https://picsum.photos/id/1061/800/1000"
    ],
    desc: "Fun polka dot dress with retro vibes — great for parties."
  }
];

/* ------------- Utilities ------------- */
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
function qs(name){ // read query string param
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

/* ------------- CART (localStorage) ------------- */
const CART_KEY = "dresslab_cart_v1";
function readCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY))||[] } catch(e){return []} }
function writeCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){
  const count = readCart().reduce((s,i)=>s+i.qty,0);
  $$("#cart-count").forEach(el=>el.textContent = count);
}

/* ------------- PAGE: INDEX (catalog) ------------- */
function renderCatalog(){
  const grid = $("#productsGrid");
  const noResults = $("#noResults");
  if(!grid) return;
  const search = ( $("#searchInput") ? $("#searchInput").value.trim().toLowerCase() : "" );
  const priceRange = $("#priceRange") ? $("#priceRange").value : "all";
  const sortBy = $("#sortBy") ? $("#sortBy").value : "featured";

  // filter by category checkboxes
  const selectedCats = $$(".category:checked").map(i=>i.dataset.cat);
  const selectedGenders = $$(".filter:checked").map(i=>i.dataset.filter);

  let results = PRODUCTS.filter(p=>{
    if(selectedCats.length && !selectedCats.includes(p.category)) return false;
    if(selectedGenders.length && !selectedGenders.includes(p.gender)) return false;
    if(search && !(p.title.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search))) return false;
    // price range
    if(priceRange !== "all"){
      const [min,max] = priceRange.split("-").map(Number);
      if(!(p.price >= min && p.price <= max)) return false;
    }
    return true;
  });

  // sorting
  if(sortBy === "price-asc") results.sort((a,b)=>a.price-b.price);
  if(sortBy === "price-desc") results.sort((a,b)=>b.price-a.price);
  if(sortBy === "rating-desc") results.sort((a,b)=>b.rating-b.rating);

  grid.innerHTML = "";
  if(results.length === 0){ noResults.hidden = false; return; } else noResults.hidden = true;

  results.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div style="position:relative">
        <div class="product-media">
          <img src="${p.images[0]}" alt="${p.title}">
        </div>
        <div style="position:absolute;top:12px;left:12px" class="badge">${p.rating}★</div>
      </div>
      <div class="product-title">${p.title}</div>
      <div class="product-brand">${p.brand}</div>
      <div class="price-row">
        <div class="price">₹${p.price}</div>
        <div class="mrp">${p.mrp ? "₹"+p.mrp : ""}</div>
      </div>
    `;
    card.addEventListener("click", ()=> {
      window.location.href = `product.html?id=${p.id}`;
    });
    grid.appendChild(card);
  });
}

/* ------------- PAGE: PRODUCT ------------- */
function renderProduct(){
  const id = Number(qs("id"));
  if(!id) return;
  const p = PRODUCTS.find(x=>x.id === id);
  if(!p) return;
  // fields
  $("#p-title").textContent = p.title;
  $("#p-brand").textContent = p.brand;
  $("#p-rating").textContent = `★ ${p.rating}`;
  $("#p-price").textContent = p.price;
  $("#p-mrp").textContent = p.mrp;
  $("#p-desc").textContent = p.desc;

  // gallery
  const gm = $("#gallery-main");
  const thumbs = $("#thumbs");
  gm.innerHTML = `<img src="${p.images[0]}" alt="${p.title}">`;
  thumbs.innerHTML = "";
  p.images.forEach((img, idx)=>{
    const t = document.createElement("img");
    t.src = img; if(idx===0) t.classList.add("active");
    t.addEventListener("click", ()=> {
      gm.innerHTML = `<img src="${img}" alt="${p.title}">`;
      $$("#thumbs img").forEach(x=>x.classList.remove("active"));
      t.classList.add("active");
    });
    thumbs.appendChild(t);
  });

  // sizes
  const sizesCont = $("#sizeOptions");
  sizesCont.innerHTML = "";
  (p.sizes || []).forEach(sz=>{
    const chip = document.createElement("div");
    chip.className = "size-chip";
    chip.textContent = sz;
    chip.addEventListener("click", ()=> {
      $$("#sizeOptions .size-chip").forEach(x=>x.classList.remove("selected"));
      chip.classList.add("selected");
    });
    sizesCont.appendChild(chip);
  });

  // colors
  const colorsCont = $("#colorOptions");
  colorsCont.innerHTML = "";
  (p.colors || []).forEach((c, idx)=>{
    const sw = document.createElement("div");
    sw.className = "color-swatch";
    sw.style.background = c.code;
    if(idx===0) sw.classList.add("selected");
    sw.addEventListener("click", ()=>{
      $$("#colorOptions .color-swatch").forEach(x=>x.classList.remove("selected"));
      sw.classList.add("selected");
      // change main image if color has img
      const chosenImg = c.img || p.images[0];
      $("#gallery-main").innerHTML = `<img src="${chosenImg}" alt="${p.title}">`;
      $$("#thumbs img").forEach(t=> t.classList.remove("active"));
    });
    colorsCont.appendChild(sw);
  });

  // Add to cart
  $("#addToCartBtn").addEventListener("click", ()=> {
    const sizeSel = $$("#sizeOptions .size-chip.selected")[0]?.textContent || null;
    const colorIndex = $$("#colorOptions .color-swatch").indexOf($$("#colorOptions .color-swatch.selected")[0]);
    const color = p.colors[colorIndex] || p.colors[0];
    if(!sizeSel){
      alert("Please select a size.");
      return;
    }
    addToCart(p.id, sizeSel, color);
    alert("Added to cart");
    window.location.href = "cart.html";
  });

  $("#buyNowBtn").addEventListener("click", ()=>{
    const sizeSel = $$("#sizeOptions .size-chip.selected")[0]?.textContent || null;
    if(!sizeSel){ alert("Please select a size."); return; }
    addToCart(p.id, sizeSel, p.colors[0]);
    window.location.href = "cart.html";
  });
}

/* ------------- CART HELPERS ------------- */
function addToCart(productId, size, color){
  const cart = readCart();
  const existing = cart.find(i=> i.productId===productId && i.size===size && i.colorName===color.name);
  if(existing){
    existing.qty += 1;
  } else {
    cart.push({ productId, size, colorName: color.name, colorCode: color.code, qty: 1 });
  }
  writeCart(cart);
}

function renderCart(){
  const list = $("#cartList");
  const empty = $("#cartEmpty");
  const summary = $("#cartSummary");
  if(!list) return;
  const cart = readCart();
  if(cart.length === 0){
    empty.style.display = "block"; list.innerHTML = ""; summary.hidden = true; return;
  }
  empty.style.display = "none"; summary.hidden = false;
  list.innerHTML = "";
  let subtotal = 0;
  cart.forEach((item, idx)=>{
    const p = PRODUCTS.find(x=>x.id === item.productId);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${p.images[0]}" alt="${p.title}">
      <div class="info">
        <div class="title">${p.title}</div>
        <div class="meta">${item.size} • ${item.colorName}</div>
        <div class="muted">₹${p.price} each</div>
      </div>
      <div class="qty">
        <button class="dec">-</button>
        <div class="qty-num">${item.qty}</div>
        <button class="inc">+</button>
      </div>
      <div class="line-price">₹${p.price * item.qty}</div>
      <div><button class="remove">Remove</button></div>
    `;
    // events
    row.querySelector(".inc").addEventListener("click", ()=> {
      item.qty += 1; writeCart(cart); renderCart();
    });
    row.querySelector(".dec").addEventListener("click", ()=> {
      if(item.qty>1){ item.qty -=1; writeCart(cart); renderCart(); }
      else { // remove
        if(confirm("Remove this item?")){ cart.splice(idx,1); writeCart(cart); renderCart(); }
      }
    });
    row.querySelector(".remove").addEventListener("click", ()=> {
      if(confirm("Remove this item?")){ cart.splice(idx,1); writeCart(cart); renderCart(); }
    });

    list.appendChild(row);
    subtotal += p.price * item.qty;
  });

  const shipping = subtotal > 1999 ? 0 : 99;
  $("#summarySubtotal").textContent = `₹${subtotal}`;
  $("#summaryShipping").textContent = `₹${shipping}`;
  $("#summaryTotal").textContent = `₹${subtotal + shipping}`;
}

/* ------------- BOOTSTRAP / EVENTS ------------- */
function initCommon(){
  // attach listeners for filters & search
  if($("#searchInput")){
    $("#searchInput").addEventListener("input", debounce(renderCatalog, 220));
  }
  $$(".category, .filter, #priceRange, #sortBy").forEach(el=>{
    el.addEventListener("change", renderCatalog);
  });
  updateCartCount();
  // handle nav cart-count on pages that don't have element
  if(!$("#cart-count")){
    const sp = document.createElement("span");
    sp.id = "cart-count"; document.body.appendChild(sp); updateCartCount();
  }
}

// simple debounce
function debounce(fn, wait=200){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }

/* ------------- PAGE ROUTER ------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  initCommon();
  const body = document.body;
  if(body.classList.contains("page-home") || body.classList.contains("page-home")==false && window.location.pathname.endsWith("index.html") ){
    renderCatalog();
  }
  if(body.classList.contains("page-product") || window.location.pathname.endsWith("product.html")){
    renderProduct();
  }
  if(body.classList.contains("page-cart") || window.location.pathname.endsWith("cart.html")){
    renderCart();
  }

  // cart-count refresh on all pages
  updateCartCount();
});

