import { loadDataWithNoCallback } from './loaders.js';

document.addEventListener('DOMContentLoaded', function() {


});



loadDataWithNoCallback("panier/1")
    .then((p) => {
        // Utiliser les données récupérées
        console.log(p)
        updateCartDom(p)
    }) 
    .catch(error => {
        // Gérer les erreurs ici
        console.error('Une erreur est survenue lors du chargement des produits :', error);
    });
 

    function updateCartDom(paniers) {
        console.log(paniers)
        let tbody = document.getElementById('cartItems')

        tbody.innerHTML = ''


        paniers.forEach(panier => {
            let price = panier.qteProduit * panier.produit.prixP
            console.log(typeof price)
            let cartInfos = document.createElement('tr')
            cartInfos.innerHTML = `
            <td scope="row" class="py-4">
                    <div class="cart-info d-flex flex-wrap align-items-center mb-4" >
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
                      <input type="text" name="quantity" class="form-control input-number text-center"
                        value="${panier.qteProduit}">
                      <span class="input-group-btn">
                        <button type="button" class="quantity-right-plus btn btn-light btn-number" data-type="plus"
                          data-field="">
                          <svg width="16" height="16">
                            <use xlink:href="#plus"></use>
                          </svg>
                        </button>
                      </span>
                    </div>
                  </td>
                  <td class="py-4">
                    <div class="total-price">
                      <span id='span-${panier.produit.codeP}' class="money text-dark">${price} $</span>
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
            `
            tbody.appendChild(cartInfos)
        });

        let inputs = document.querySelectorAll('#productTable tr input.input-number');

        // Parcours de chaque élément input et ajout d'un écouteur d'événements
        inputs.forEach(function(input) {
            input.addEventListener('change', function(event) {
                // Action à effectuer lorsqu'un changement se produit dans l'input
                console.log("La valeur a changé :", event.target.value);
            });
        });
        
    }

    