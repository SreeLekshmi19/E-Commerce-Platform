// ==========================
// ShopEase - app.js (Part 1)
// ==========================

// API URL
const API_URL = "https://fakestoreapi.com/products";

// DOM Elements
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search");
const themeBtn = document.getElementById("theme-btn");
const cartCount = document.getElementById("cart-count");
const wishCount = document.getElementById("wish-count");

// Global Data
let products = [];
let filteredProducts = [];

// ==========================
// INITIALIZE
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    loadCounters();

    fetchProducts();

});

// ==========================
// FETCH PRODUCTS
// ==========================

async function fetchProducts() {

    productGrid.innerHTML = `
        <div class="loader"></div>
    `;

    try {

        const response = await fetch(API_URL);

        products = await response.json();

        filteredProducts = [...products];

        renderProducts(filteredProducts);

    }

    catch (error) {

        console.error(error);

        productGrid.innerHTML = `
        <div class="empty-products">
            <h2>Oops!</h2>
            <p>Unable to load products.</p>
        </div>
        `;

    }

}

// ==========================
// RENDER PRODUCTS
// ==========================

function renderProducts(data) {

    if (data.length === 0) {

        productGrid.innerHTML = `
        <div class="empty-products">
            <h2>No Products Found</h2>
            <p>Try another search.</p>
        </div>
        `;

        return;

    }

    productGrid.innerHTML = "";

    data.forEach(product => {

        productGrid.innerHTML += `

<div class="product-card">

<div class="badge new">
NEW
</div>

<div class="product-image">

<img src="${product.image}" alt="${product.title}">

</div>

<div class="product-info">

<p class="product-category">

${product.category}

</p>

<h3 class="product-title">

${product.title}

</h3>

<p class="product-description">

${product.description.substring(0, 90)}...

</p>

<div class="rating">

${generateStars(product.rating.rate)}

<span>

(${product.rating.count})

</span>

</div>

<div class="price-row">

<div>

<span class="price">

$${product.price}

</span>

</div>

</div>

<div class="card-buttons">

<button
class="add-cart"
onclick="addToCart(${product.id})">

Add to Cart

</button>

<button
class="wishlist-btn"
onclick="addToWishlist(${product.id})">

<i class="fa-solid fa-heart"></i>

</button>

</div>

</div>

</div>

`;

    });

}

// ==========================
// STAR RATING
// ==========================

function generateStars(rate) {

    let stars = "";

    const rounded = Math.round(rate);

    for (let i = 1; i <= 5; i++) {

        if (i <= rounded) {

            stars += `<i class="fa-solid fa-star"></i>`;

        }

        else {

            stars += `<i class="fa-regular fa-star"></i>`;

        }

    }

    return stars;

}

// ==========================
// SEARCH
// ==========================

searchInput.addEventListener("input", function () {

    const value = this.value.toLowerCase();

    filteredProducts = products.filter(product => {

        return (

            product.title.toLowerCase().includes(value)

            ||

            product.category.toLowerCase().includes(value)

        );

    });

    renderProducts(filteredProducts);

});

// ==========================
// DARK MODE
// ==========================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML = `
        <i class="fa-solid fa-sun"></i>
        `;

    }

    else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML = `
        <i class="fa-solid fa-moon"></i>
        `;

    }

});

// ==========================
// LOAD THEME
// ==========================

function loadTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML = `
        <i class="fa-solid fa-sun"></i>
        `;

    }

}

// ==========================
// COUNTERS
// ==========================

function loadCounters() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    cartCount.textContent = cart.length;

    wishCount.textContent = wishlist.length;

}

// ==========================
// PLACEHOLDERS
// (Implemented in Part 2)
// ==========================

function addToCart(id) {

    console.log("Cart:", id);

}

function addToWishlist(id) {

    console.log("Wishlist:", id);

}

// ==========================
// ShopEase - app.js (Part 2)
// Cart, Wishlist & Toast
// ==========================

// Load data from Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ==========================
// SAVE FUNCTIONS
// ==========================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounters();
}

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateCounters();
}

// ==========================
// UPDATE COUNTERS
// ==========================

function updateCounters() {
    cartCount.textContent = cart.length;
    wishCount.textContent = wishlist.length;
}

// ==========================
// ADD TO CART
// ==========================

function addToCart(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    showToast(`${product.title} added to cart`);

}

// ==========================
// ADD TO WISHLIST
// ==========================

function addToWishlist(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const exists = wishlist.find(item => item.id === id);

    if (exists) {

        showToast("Already in wishlist");

        return;

    }

    wishlist.push(product);

    saveWishlist();

    showToast(`${product.title} added to wishlist`);

}

// ==========================
// REMOVE FROM CART
// ==========================

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();

    renderCart();

    showToast("Item removed");

}

// ==========================
// REMOVE FROM WISHLIST
// ==========================

function removeFromWishlist(id) {

    wishlist = wishlist.filter(item => item.id !== id);

    saveWishlist();

    renderWishlist();

    showToast("Removed from wishlist");

}

// ==========================
// CHANGE QUANTITY
// ==========================

function increaseQuantity(id) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity++;

    saveCart();

    renderCart();

}

function decreaseQuantity(id) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    if (item.quantity > 1) {

        item.quantity--;

    } else {

        removeFromCart(id);

        return;

    }

    saveCart();

    renderCart();

}

// ==========================
// CART TOTAL
// ==========================

function calculateTotal() {

    return cart.reduce((total, item) => {

        return total + item.price * item.quantity;

    }, 0);

}

// ==========================
// TOAST NOTIFICATION
// ==========================

function showToast(message) {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

// ==========================
// CART PAGE
// ==========================

function renderCart() {

    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `
        <div class="empty-products">
            <h2>Your Cart is Empty</h2>
            <p>Add products to continue shopping.</p>
        </div>
        `;

        return;

    }

    container.innerHTML = "";

    cart.forEach(item => {

        container.innerHTML += `

<div class="cart-item">

<img src="${item.image}" alt="${item.title}">

<div class="cart-details">

<h3>${item.title}</h3>

<p class="cart-price">$${item.price}</p>

</div>

<div class="cart-actions">

<button
class="quantity-btn"
onclick="decreaseQuantity(${item.id})">

-

</button>

<span>${item.quantity}</span>

<button
class="quantity-btn"
onclick="increaseQuantity(${item.id})">

+

</button>

<button
class="remove-btn"
onclick="removeFromCart(${item.id})">

Remove

</button>

</div>

</div>

`;

    });

    const total = document.getElementById("cart-total");

    if (total) {

        total.textContent = "$" + calculateTotal().toFixed(2);

    }

}

// ==========================
// WISHLIST PAGE
// ==========================

function renderWishlist() {

    const container = document.getElementById("wishlist-grid");

    if (!container) return;

    if (wishlist.length === 0) {

        container.innerHTML = `
        <div class="empty-products">
            <h2>Your Wishlist is Empty</h2>
            <p>Save your favorite products here.</p>
        </div>
        `;

        return;

    }

    container.innerHTML = "";

    wishlist.forEach(product => {

        container.innerHTML += `

<div class="product-card">

<div class="product-image">

<img src="${product.image}" alt="${product.title}">

</div>

<div class="product-info">

<h3 class="product-title">

${product.title}

</h3>

<p class="price">

$${product.price}

</p>

<div class="card-buttons">

<button
class="add-cart"
onclick="addToCart(${product.id})">

Add to Cart

</button>

<button
class="wishlist-btn"
onclick="removeFromWishlist(${product.id})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

</div>

`;

    });

}

// ==========================
// AUTO LOAD PAGES
// ==========================

renderCart();

renderWishlist();

updateCounters();

// ==========================
// ShopEase - app.js (Part 3)
// ==========================

// DOM Elements
const categoryFilter = document.getElementById("category-filter");
const sortProducts = document.getElementById("sort-products");

// ==========================
// LOAD CATEGORIES
// ==========================

function loadCategories() {

    if (!categoryFilter) return;

    const categories = [...new Set(products.map(product => product.category))];

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent =
            category.charAt(0).toUpperCase() + category.slice(1);

        categoryFilter.appendChild(option);

    });

}

// ==========================
// CATEGORY FILTER
// ==========================

if (categoryFilter) {

    categoryFilter.addEventListener("change", function () {

        if (this.value === "all") {

            filteredProducts = [...products];

        } else {

            filteredProducts = products.filter(product =>
                product.category === this.value
            );

        }

        renderProducts(filteredProducts);

    });

}

// ==========================
// SORTING
// ==========================

if (sortProducts) {

    sortProducts.addEventListener("change", function () {

        let sorted = [...filteredProducts];

        switch (this.value) {

            case "price-low":

                sorted.sort((a, b) => a.price - b.price);

                break;

            case "price-high":

                sorted.sort((a, b) => b.price - a.price);

                break;

            case "name":

                sorted.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );

                break;

            default:

                sorted = [...filteredProducts];

        }

        renderProducts(sorted);

    });

}

// ==========================
// CLEAR CART
// ==========================

function clearCart() {

    cart = [];

    saveCart();

    renderCart();

    showToast("Cart cleared");

}

// ==========================
// PLACE ORDER
// ==========================

function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    localStorage.removeItem("cart");

    cart = [];

    updateCounters();

    showToast("Order placed successfully!");

    setTimeout(() => {

        window.location.href = "index.html";

    }, 1500);

}

// ==========================
// FORMAT PRICE
// ==========================

function formatPrice(price) {

    return "$" + Number(price).toFixed(2);

}

// ==========================
// SEARCH BY CATEGORY
// ==========================

function searchProducts(keyword) {

    keyword = keyword.toLowerCase();

    filteredProducts = products.filter(product =>

        product.title.toLowerCase().includes(keyword) ||

        product.category.toLowerCase().includes(keyword)

    );

    renderProducts(filteredProducts);

}

// ==========================
// SCROLL TO TOP
// ==========================

function scrollTopButton() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// ==========================
// PAGE INITIALIZATION
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    loadCategories();

    updateCounters();

    renderCart();

    renderWishlist();

});