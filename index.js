//KHỞI TẠO DỮ LIỆU SẢN PHẨM (Product Catalog)
const products = [
    {
        id: 1,
        name: "Tai nghe Bluetooth TWS",
        price: 350000,
        image: "https://picsum.photos/seed/tws/200",
        description: "Chống ồn, pin 8h, kết nối ổn định."
    },
    {
        id: 2,
        name: "Chuột không dây Silent",
        price: 250000,
        image: "https://picsum.photos/seed/mouse/200",
        description: "Thiết kế công thái học, không gây tiếng ồn."
    },
    {
        id: 3,
        name: "Bàn phím cơ RGB",
        price: 850000,
        image: "https://picsum.photos/seed/kb/200",
        description: "Blue switch, đèn nền 16.8 triệu màu."
    }
];

// Biến toàn cục lưu trữ giỏ hàng
let cart = [];

//MODULE QUẢN LÝ LOCALSTORAGE (Yêu cầu 3.3)
const STORAGE_KEY = 'miniShopCart';

function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        cart = data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Dữ liệu LocalStorage bị lỗi:", error);
        cart = []; // Reset giỏ hàng rỗng
        saveCart(); // Ghi đè lại để dọn dẹp dữ liệu corrupt
    }
}

//MODULE TIỆN ÍCH & FORMAT (Yêu cầu 3.2)
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Tìm kiếm sản phẩm theo ID
const findProductById = (id) => products.find(p => p.id === id);

//4. MODULE RENDER GIAO DIỆN (Yêu cầu 3.5 & 4)


// Render danh sách sản phẩm 
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const emptyMsg = document.getElementById('products-empty');
    
    if (products.length === 0) {
        emptyMsg.classList.remove('hidden');
        productsGrid.innerHTML = '';
        return;
    }

    emptyMsg.classList.add('hidden');
    productsGrid.innerHTML = products.map(product => `
        <article class="card">
            <div class="card-img"><img src="${product.image}" alt="${product.name}"></div>
            <div class="card-body">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-desc">${product.description}</p>
                <div class="card-footer">
                    <div class="price">${formatVND(product.price)}</div>
                    <button class="btn btn-primary" onclick="handleAddToCart(${product.id})">Thêm vào giỏ</button>
                </div>
            </div>
        </article>
    `).join('');
    
    document.getElementById('product-count-badge').innerText = `${products.length} sản phẩm`;
}

// Render giỏ hàng & Thống kê
function renderCart() {
    const tbody = document.getElementById('cart-tbody');
    const emptyMsg = document.getElementById('cart-empty');

    if (cart.length === 0) {
        emptyMsg.classList.remove('hidden');
        tbody.innerHTML = '';
    } else {
        emptyMsg.classList.add('hidden');
        tbody.innerHTML = cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td class="right">${formatVND(item.price)}</td>
                <td class="center">
                    <div class="qty-controls">
                        <button onclick="handleUpdateQty(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="handleUpdateQty(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td class="right">${formatVND(item.price * item.quantity)}</td>
                <td class="center">
                    <button class="btn-danger" onclick="handleRemoveItem(${item.id})">Xóa</button>
                </td>
            </tr>
        `).join('');
    }

    renderStats();
    saveCart();
}

// Render thống kê 
function renderStats() {
    const totalLines = cart.length;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('cart-lines-badge').innerText = `${totalLines} dòng`;
    document.getElementById('cart-qty-badge').innerText = `${totalQty} món`;
    document.getElementById('stat-lines').innerText = totalLines;
    document.getElementById('stat-qty').innerText = totalQty;
    document.getElementById('stat-total').innerText = formatVND(totalPrice);
}

//5. MODULE NGHIỆP VỤ (BUSINESS LOGIC)

window.handleAddToCart = (id) => {
    const product = findProductById(id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
};

// Cập nhật số lượng 
window.handleUpdateQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    renderCart();
};

// Xóa 1 sản phẩm 
window.handleRemoveItem = (id) => {
    const item = cart.find(i => i.id === id);
    if (confirm(`Bạn có chắc chắn muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
        cart = cart.filter(i => i.id !== id);
        renderCart();
    }
};

// Xóa toàn bộ giỏ 
document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (cart.length === 0) return;
    if (confirm("Bạn có chắc chắn muốn xóa TOÀN BỘ giỏ hàng không?")) {
        cart = [];
        renderCart();
    }
});


 //6. KHỞI CHẠY ỨNG DỤNG

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
    renderCart();
});