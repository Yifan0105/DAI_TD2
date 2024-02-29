import { loadDataWithNoCallback } from './loaders.js';

document.addEventListener('DOMContentLoaded', function() {
    loadDataWithNoCallback("panier/1")
        .then((p) => {
            console.log(p);
            updateCartDom(p);
            displayTotalPrice(p)
        }) 
        .catch(error => {
            console.error('Une erreur est survenue lors du chargement des produits :', error);
        });
});

function updateCartDom(paniers) {
    let tbody = document.getElementById('cartItems');
    tbody.innerHTML = '';

    paniers.forEach(panier => {
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
                <div class="input-group product-qty w-50">
                    <span class="input-group-btn">
                        <button type="button" class="quantity-left-minus btn btn-light btn-number" data-type="minus">
                            <svg width="16" height="16">
                                <use xlink:href="#minus"></use>
                            </svg>
                        </button>
                    </span>
                    <input type="text" name="quantity" class="input-number" value="${panier.qteProduit}">
                    <span class="input-group-btn">
                        <button type="button" class="quantity-right-plus btn btn-light btn-number" data-type="plus" data-field="">
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

        // 获取数量输入框和商品总价元素
        let quantityInput = cartInfos.querySelector('.input-number');
        let totalPriceElement = cartInfos.querySelector('.total-price .money');

        // 添加事件监听器，当数量改变时更新商品总价
        quantityInput.addEventListener('change', function(event) {
            let newQuantity = parseInt(event.target.value);
            if (!isNaN(newQuantity) && newQuantity >= 0) {
                let newPrice = newQuantity * panier.produit.prixP;
                totalPriceElement.textContent = newPrice + "$";
                displayTotalPrice(paniers)
            }
        });
    });
  }
    function displayTotalPrice(paniers) {
      let totalPrice = paniers.reduce((total, panier) => {
          return total + panier.qteProduit * panier.produit.prixP;
      }, 0);

      let totalPriceContainer1 = document.getElementById('totalPriceContainer1');
      let totalPriceContainer2 = document.getElementById('totalPriceContainer2');

      totalPriceContainer1.innerText = `Prix total: ${totalPrice}$`;
      totalPriceContainer2.innerText = `Prix total: ${totalPrice}$`;

  }

