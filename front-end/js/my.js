// 模拟从后端获取的产品数据（这里只是示例数据）
var productsData = [
    { name: "Sunstar Fresh Melon Juice", image: "images/thumb-bananas.png", price: "$18.00" },
    { name: "Sunstar Fresh Melon Juice", image: "images/thumb-biscuits.png", price: "$18.00" },
    // 其他产品数据...
];

// 获取要插入产品的父容器

// 为添加购物车按钮添加点击事件
var addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(function(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        var productElement = this.closest('.product-item');
        var productName = productElement.querySelector('h3').textContent;
        var productPrice = productElement.querySelector('.price').textContent;
        // 将产品名称和价格存储到本地存储中
        var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push({ name: productName, price: productPrice });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        alert('已将物品添加到购物车');
    });
});