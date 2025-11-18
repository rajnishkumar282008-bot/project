
const menuData = [

    { id: 100, name: "Fiesta-Sized Mexican Tacos", description: "Three soft-shell tacos with seasoned beef, lettuce, cheese, pico de gallo, and Flaame sour cream.", price: 450.00 },
    

    { id: 1, name: "Classic Fried Rice", description: "long-grain basmati rice is wok-tossed at high heat with a fresh vegetables—including diced carrots, green peas..", price: 200.00 },
    { id: 2, name: "Steamed Momos (8pc)", description: "Delicate steamed dumplings filled with vegetables, served with spicy dip.", price: 100.00 },
    { id: 3, name: "Margherita Pizza", description: "Classic pizza with fresh tomatoes, mozzarella on a crispy crust.", price: 350.00 },
    { id: 4, name: "Flaame Burger", description: "Our signature aloo patty, cheddar cheese, lettuce, tomato, and secret Flaame sauce.", price: 99.00 },
    { id: 5, name: "Spaghetti", description: "A rich, slow-cooked sauce served over perfectly cooked spaghetti.", price: 320.00 },
    { id: 6, name: "Volcano Lava Cake", description: "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.", price: 79.00 }
];



let cart = [];


const menuList = document.getElementById('menu-items');
const cartCountElement = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeButton = document.querySelector('.close-button');
const cartItemsDisplay = document.getElementById('cart-items-display');
const cartTotalElement = document.getElementById('cart-total');
const specialAddToCartButton = document.querySelector('.add-special-to-cart');



function renderMenu() {
    menuData.forEach(item => {
        if (item.id === 100) return; 

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');
        itemDiv.dataset.id = item.id;
        

        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="price">₹${item.price.toFixed(2)}</span>
            <button class="add-to-cart">Add to Cart</button>
        `;
        menuList.appendChild(itemDiv);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemElement = event.target.closest('.menu-item');
            const itemId = parseInt(itemElement.dataset.id);
            addItemToCart(itemId);
        });
    });
}



function addItemToCart(itemId) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const menuItem = menuData.find(item => item.id === itemId);
        if (menuItem) {
            cart.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1
            });
        }
    }
    updateCartDisplay();
    alert(`${menuData.find(item => item.id === itemId).name} added to cart!`);
}

function updateItemQuantity(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartDisplay();
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsDisplay.innerHTML = '<p>Your cart is empty.</p>';

        cartTotalElement.textContent = '₹0.00';
        return;
    }

    cartItemsDisplay.innerHTML = '';
    
    cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item-row');
        
        const subtotal = item.price * item.quantity;
        
 
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong> 
                <small>(₹${item.price.toFixed(2)} ea.)</small>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}" data-action="increase">+</button>
            </div>
            <div class="cart-item-price">₹${subtotal.toFixed(2)}</div>
        `;
        cartItemsDisplay.appendChild(itemRow);
    });

    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = parseInt(event.target.dataset.id);
            const action = event.target.dataset.action;
            const cartItem = cart.find(item => item.id === itemId);

            if (cartItem) {
                let newQuantity = cartItem.quantity;
                if (action === 'increase') {
                    newQuantity++;
                } else if (action === 'decrease') {
                    newQuantity--;
                }
                updateItemQuantity(itemId, newQuantity);
            }
        });
    });


    cartTotalElement.textContent = `₹${calculateTotal().toFixed(2)}`;
}

function updateCartDisplay() {
    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    renderCartItems();
}



function init() {
    renderMenu();
    updateCartDisplay();

    cartIcon.addEventListener('click', () => {
        renderCartItems();
        cartModal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    document.querySelector('.checkout-button').addEventListener('click', () => {
        if (cart.length > 0) {

            alert(`Order Placed!\nTotal amount: ₹${calculateTotal().toFixed(2)}\nThank you for your order!`);
            cart = [];
            updateCartDisplay();
            cartModal.style.display = 'none';
        } else {
            alert('Your cart is empty. Please add items to place an order.');
        }
    });

    document.querySelector('.contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Thank you for your message! We will be in touch soon.');
        event.target.reset();
    });

    specialAddToCartButton.addEventListener('click', () => {
        addItemToCart(100);
    });
}


init();