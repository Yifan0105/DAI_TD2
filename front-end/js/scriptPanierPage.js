import { loadDataWithNoCallback } from './loaders.js';

document.addEventListener('DOMContentLoaded', function() {
    let paniersData = [];
    loadDataWithNoCallback("panier/1")
        .then((p) => {
            console.log(p);
            paniersData = p;
            updateCartDom(p);
            displayTotalPrice();
            
            // 调用按钮点击事件处理程序
            bindQuantityButtons();
        }) 
        .catch(error => {
            console.error('Une erreur est survenue lors du chargement des produits :', error);
        });
});

// 新增一个函数，用于绑定按钮点击事件处理程序
function bindQuantityButtons() {
    let quantityButtons = document.querySelectorAll('.btn-number');
    quantityButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            let index = parseInt(event.target.dataset.index);
            let quantityInput = document.querySelector(`.input-number[data-index="${index}"]`);
            let currentValue = parseInt(quantityInput.value);
            let type = event.target.dataset.type;

            if (type === "minus") {
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            } else if (type === "plus") {
                quantityInput.value = currentValue + 1;
            }

            // 触发输入框的change事件，以便更新总价
            quantityInput.dispatchEvent(new Event('change'));
        });
    });
}

function updateCartDom(paniers) {
    let tbody = document.getElementById('cartItems');
    tbody.innerHTML = '';

    paniers.forEach((panier, index) => {
        let price = panier.qteProduit * panier.produit.prixP;
        
        let cartInfos = document.createElement('tr');
        cartInfos.innerHTML = `
            <td scope="row" class="py-4">
                <div class="cart-info d-flex flex-wrap align-items-center mb-4">
                    <div class="col-lg-3">
                        <div class="card-image">
                            <img src="http://localhost:8080/static/images/${panier.produit.productImage}" alt="${panier.produit.nomP}" class="img-fluid">
                        </div>
                    </div>
                    <div class="col-lg-9">
                        <div class="card-detail ps-3">
                            <h5 class="card-title">
                                <a href="#" class="text-decoration-none">${panier.produit.nomP}</a>
                            </h5>
                        </div>
                    </div>
                </div>
            </td>
            <td class="py-4">
                <div class="input-group product-qty">
                    <span class="input-group-btn">
                        <button type="button" class="quantity-left-minus btn btn-light btn-number" data-type="minus" data-index="${index}">
                            <svg width="16" height="16">
                                <use xlink:href="#minus"></use>
                            </svg>
                        </button>
                    </span>
                    <input type="text" name="quantity" class="input-number form-control" value="${panier.qteProduit}" data-index="${index}">
                    <span class="input-group-btn">
                        <button type="button" class="quantity-right-plus btn btn-light btn-number" data-type="plus" data-index="${index}">
                            <svg width="16" height="16">
                                <use xlink:href="#plus"></use>
                            </svg>
                        </button>
                    </span>
                </div>
            </td>
            <td class="py-4">
                <div class="total-price">
                    <span id='span-${panier.produit.codeP}' name="money" class="money text-dark">${price}$</span>
                </div>
            </td>
            <td class="py-4">
                <div class="cart-remove">
                    <a href="#">
                        <svg width="24" height="24">
                            <use xlink:href="#trash"></use>
                        </svg>
                    </a>
                </div>
            </td>
        `;
        tbody.appendChild(cartInfos);
    });

    // 获取数量输入框和商品总价元素
    let quantityInputs = document.querySelectorAll('.input-number');
    let totalPriceElements = document.querySelectorAll('.total-price .money');

    // 添加事件监听器，当数量改变时更新商品总价
    quantityInputs.forEach(quantityInput => {
        quantityInput.addEventListener('change', function(event) {
            let index = parseInt(event.target.dataset.index);
            let newQuantity = parseInt(event.target.value);
            if (!isNaN(newQuantity) && newQuantity >= 0) {
                let newPrice = newQuantity * paniers[index].produit.prixP;
                totalPriceElements[index].textContent = newPrice + "$";
                displayTotalPrice();
            }
        });
    });
}

function displayTotalPrice() {
    let paniers = document.querySelectorAll('#cartItems tr');
    let totalPrice = 0;

    paniers.forEach(panier => {
        let priceElement = panier.querySelector('.total-price .money');
        let price = parseFloat(priceElement.textContent.replace('$', ''));
        totalPrice += price;
    });

    let totalPriceContainers = document.querySelectorAll('.total-price-container');

    totalPriceContainers.forEach(container => {
        container.innerText = `Prix total: ${totalPrice}$`;
    });
}
