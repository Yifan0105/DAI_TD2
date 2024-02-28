import { loadDataWithNoCallback } from "./loaders.js";

// Création d'un nouvel objet URLSearchParams avec la chaîne de requête de l'URL actuelle
const params = new URLSearchParams(window.location.search);

// Récupération de la valeur d'un paramètre spécifique
const productId = params.get('productId');

loadDataWithNoCallback(`products/${productId}`)
    .then((p) => {
        // Utiliser les données récupérées
        updateDomWithProductInfos(p)
    })
    .catch(error => {
        // Gérer les erreurs ici
        console.error('Une erreur est survenue lors du chargement des produits :', error);
    });


    function updateDomWithProductInfos(product) {
        let productContainer = document.getElementById('productToDisplay');
    
        // Nettoyer le contenu existant
        productContainer.innerHTML = '';
    
        // Image du produit
        let imageDiv = document.createElement('div');
        imageDiv.classList.add('col-lg-7');
        imageDiv.innerHTML = `
            <div class="row flex-column-reverse flex-lg-row">
                <div class="col-md-12 col-lg-10">
                    <div class="swiper product-large-slider">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="image-zoom" data-scale="2.5" data-image="images/product-large-1.jpg"><img
                                        src="http://localhost:8080/static/images/${product.productImage}" alt="${product.nomP}" class="img-fluid"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            productContainer.appendChild(imageDiv);
    
        // Infos du produit
        let infoDiv = document.createElement('div');
        infoDiv.setAttribute('data-product-id',product.codeP)
        infoDiv.classList.add('col-lg-5');
        infoDiv.innerHTML = `
            <div class="product-info">
                <div class="element-header">
                    <h2 itemprop="name" class="display-6">${product.nomP}</h2>
                </div>
                <div class="product-price pt-3 pb-3">
                    <strong class="text-primary display-6 fw-bold">$${product.prixP}</strong>
                </div>
                <p>${product.productDescriptionCourte}</p>
                <div class="cart-wrap py-5">
                    <div class="product-quantity pt-3">
                        <div class="stock-number text-dark"><em>2 in stock</em></div>
                            <div class="stock-button-wrap">
                                <div class="input-group product-qty" style="max-width: 150px;">
                                <span class="input-group-btn">
                                    <button type="button" class="quantity-left-minus btn btn-light btn-number"  data-type="minus" data-field="">
                                    <svg width="16" height="16"><use xlink:href="#minus"></use></svg>
                                    </button>
                                </span>
        
                                <input type="text" id="quantity" name="quantity" class="form-control input-number text-center quantity" value="1" min="1" max="100">
                                <span class="input-group-btn">
                                    <button type="button" class="quantity-right-plus btn btn-light btn-number" data-type="plus" data-field="">
                                        <svg width="16" height="16"><use xlink:href="#plus"></use></svg>
                                    </button>
                                </span>
                            </div>
        
                            <div class="qty-button d-flex flex-wrap pt-3">
                                <button type="submit" class="btn btn-primary py-3 px-4 text-uppercase me-3 mt-3">Buy now</button>
                                <button type="submit" name="add-to-cart" value="1269" class="btn btn-dark py-3 px-4 text-uppercase mt-3 add-to-cart">Add to cart</button>                      
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        productContainer.appendChild(infoDiv);

        productContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart')) {
                event.preventDefault();
                addToCart(infoDiv);
            }
        });

        let productDescriptionContainer = document.getElementById('productDescLongue');

        productDescriptionContainer.innerHTML = ""
        
        //Description longue
        let descriptionLongueDiv = document.createElement('div');
        descriptionLongueDiv.classList.add('d-flex')
        descriptionLongueDiv.classList.add("flex-column")
        descriptionLongueDiv.classList.add("flex-md-row")
        descriptionLongueDiv.classList.add("align-items-start")
        descriptionLongueDiv.classList.add("gap-5")
        descriptionLongueDiv.innerHTML = `
                <div class="nav flex-row flex-wrap flex-md-column nav-pills me-3 col-lg-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <button class="nav-link text-start active" id="v-pills-description-tab" data-bs-toggle="pill" data-bs-target="#v-pills-description" type="button" role="tab" aria-controls="v-pills-description" aria-selected="true">Description</button>
                    </div>

                    <div class="tab-content" id="v-pills-tabContent">
                    <div class="tab-pane fade show active" id="v-pills-description" role="tabpanel" aria-labelledby="v-pills-description-tab" tabindex="0">
                        <h5>Product Description</h5>
                        <p>${product.productDescriptionLongue}</p>
                    </div>
                    
                    </div>
        `

        productDescriptionContainer.appendChild(descriptionLongueDiv)
    
    }
    


    // function pour ajouter au panier
function addToCart(productElement) {
    var productId = productElement.getAttribute('data-product-id');
    var quantity = parseInt(productElement.querySelector('.quantity').value);
    console.log("Quantity:", quantity);
    console.log("Product ID:", productId);

    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    var existingItemIndex = cartItems.findIndex(item => item.id === productId);

    if (existingItemIndex !== -1) {
        // 如果存在相同的产品ID，则更新数量
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        // 否则将新的产品添加到数组中
        cartItems.push({ id: productId, quantity: quantity });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('Article ajouté dans le panier!');
}