import { loadData } from './loaders.js';
import { loadDataWithNoCallback } from './loaders.js';


document.addEventListener('DOMContentLoaded', function() {
    // Mettez vos appels de méthodes ici
    loadData("categories", updateCategoriesDOM);
    loadData("rayons", updateRayonsDOM);
});


let pageNumber = 1
//Object that stores all the products
let allProducts = [];

let currentProductsList = [];

let productsPerPage = 9;

function fetchAndLoadData(endpoint) {
    return loadDataWithNoCallback(endpoint)
      .then((produits) => {
        // Utiliser les données récupérées
        allProducts = produits;
        currentProductsList = allProducts;
        updateProductsDOM(produits, true);
      })
      .catch(error => {
        // Gérer les erreurs ici
        console.error('Une erreur est survenue lors du chargement des produits :', error);
      });
  }
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.has('inputValue')) {
    const inputValue = queryParams.get('inputValue');
    console.log("L'URL contient le paramètre inputValue:", inputValue);
    fetchAndLoadData(`products/search/${inputValue}`);
  } else {
    console.log("L'URL ne contient pas le paramètre inputValue");
    fetchAndLoadData("products");
  }


loadDataWithNoCallback("products")
    .then((produits) => {
        // Utiliser les données récupérées
        allProducts = produits;
        currentProductsList = allProducts;
        updateProductsDOM(produits, true);
    })
    .catch(error => {
        // Gérer les erreurs ici
        console.error('Une erreur est survenue lors du chargement des produits :', error);
    });

// Sélectionnez le conteneur de la liste de pagination
const paginationContainer = document.querySelector('.pagination');

// Ajoutez un écouteur d'événements au clic sur le conteneur de la liste de pagination
paginationContainer.addEventListener('click', function(event) {
// Vérifiez si l'élément cliqué est un lien de pagination
if (event.target.classList.contains('page-link')) {
    // Empêche le comportement par défaut du lien
    event.preventDefault();

    event.target.parentNode.classList.add("active");

    const previousPage = paginationContainer.querySelector(`a[data-page="${pageNumber}"]`).parentNode;
    previousPage.classList.remove("active");

    // Récupère le numéro de page à partir de l'attribut data-page
    pageNumber = parseInt(event.target.dataset.page);

    // Calcul de l'indice de départ et de fin pour les produits de la page actuelle
    const startIndex = (pageNumber - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    // Sélection des produits de la page actuelle
    const productsOnPage = currentProductsList.slice(startIndex, endIndex);

    updateProductsDOM(productsOnPage, false)

    // Utilisez le numéro de page comme vous le souhaitez (par exemple, effectuez une action en fonction de la page sélectionnée)
    console.log('Numéro de page sélectionné :', pageNumber);
    }
});

// Fonction pour mettre à jour le DOM avec les catégories
function updateCategoriesDOM(categories) {
    
    let categoriesList = document.getElementById('categoriesList');

    categories.forEach(category => {
        // Création d'un nouvel élément <li> pour chaque catégorie
        var listItem = document.createElement('li');
        listItem.classList.add('cat-item');
  
        // Création d'un nouvel élément <a> pour le lien de la catégorie
        var link = document.createElement('a');
        link.textContent = category.nomC; // Supposons que le nom de la catégorie est stocké dans la propriété "name"
        link.addEventListener('click', function() {
            const filteredProducts = filterProductByCategorie(category);
            console.log(filteredProducts);
            updateProductsDOM(filteredProducts, false);
        });
  
        // Ajout du lien à l'élément <li>
        listItem.appendChild(link);
  
        // Ajout de l'élément <li> à la liste des catégories
        categoriesList.appendChild(listItem);
    })
}


// Fonction pour mettre à jour le DOM avec les catégories
function updateRayonsDOM(rayons) {
    
    let rayonsList = document.getElementById('rayonsList');

    rayons.forEach(rayon => {
        // Création d'un nouvel élément <li> pour chaque catégorie
        var listItem = document.createElement('li');
        listItem.classList.add('rayon-item');
  
        // Création d'un nouvel élément <a> pour le lien de la catégorie
        var link = document.createElement('a');
        link.href = '#'; // Vous pouvez définir le lien réel ici si nécessaire
        link.textContent = rayon.nomR; // Supposons que le nom de la catégorie est stocké dans la propriété "name"
        link.addEventListener('click', filterProductByRayon(rayon))

  
        // Ajout du lien à l'élément <li>
        listItem.appendChild(link);
  
        // Ajout de l'élément <li> à la liste des catégories
        rayonsList.appendChild(listItem);
    })
}




function filterProductByRayon(rayon) {
        currentProductsList = allProducts.filter(product => {
        // Vérifie si au moins une catégorie du produit a le même codeC que la catégorie recherchée
        return product.rayons.some(ray => ray.codeR === rayon.codeR);
    });
    return currentProductsList;
}

function filterProductByCategorie(categorie) {
        currentProductsList = allProducts.filter(product => {
        // Vérifie si au moins une catégorie du produit a le même codeC que la catégorie recherchée
        return product.categories.some(cat => cat.codeC === categorie.codeC);
    });
    return currentProductsList;
}


function updateProductsDOM(produits, init) {

    let produitsList = document.getElementById('productsList');

    // Nettoyer le contenu existant
    produitsList.innerHTML = '';

    // Calcul de l'indice de départ et de fin pour les produits de la page actuelle
    const startIndex = (pageNumber - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    // Sélection des produits de la page actuelle
    if (init) {
        produits = allProducts.slice(startIndex, endIndex);
    } else {
        produits = produits.slice(startIndex, endIndex);
    }


    


    produits.forEach(product => {

        // Création d'un nouvel élément <div> pour chaque produit
        let productDiv = document.createElement('div');
        productDiv.classList.add('col');
        productDiv.setAttribute('data-product-id',product.codeP)
        productDiv.innerHTML = `
            <div class="product-item">
                <!-- Bouton pour ajouter aux favoris -->
                <a href="#" class="btn-wishlist" data-bs-toggle="modal" data-bs-target="#favoriteModal">
                <svg width="24" height="24">
                <use xlink:href="#heart">
                </use></svg></a>

                <!-- mondel -->
                <div class="modal fade" id="favoriteModal" tabindex="-1" aria-labelledby="favoriteModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="favoriteModalLabel">
                                Pour ce produit<br>
                                Choisir une liste de courses</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">

                            <div class="modal-body">
                            <select class="form-select" id="favoriteList">
                                <!-- Options added by updateListecourseDOM -->
                            </select>
                           </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                <button type="button" class="btn btn-primary" id="addToFavorite">Ajouter</button>
                            </div>
                        </div>
                    </div>
                </div>               

                <!-- Image du produit -->
                <figure>
                    <a href="single-product.html?productId=${product.codeP}" title="${product.nomP}">
                        <img src="http://localhost:8080/static/images/${product.productImage}" alt="Product Image" class="tab-image">
                    </a>
                </figure>

                <!-- Titre, quantité, évaluation, prix du produit -->
                <h3>${product.nomP}</h3>
                <span class="qty">1 Unité</span>
                <span class="price">${product.prixP} €</span>

                <!-- Sélecteur de quantité et bouton "Ajouter au panier" -->
                <div class="d-flex align-items-center justify-content-between">
                    <div class="input-group product-qty">
                        <!-- Bouton pour diminuer la quantité -->
                        <span class="input-group-btn">
                            <button type="button" class="quantity-left-minus btn btn-danger btn-number" data-type="minus">
                                <svg width="16" height="16"><use xlink:href="#minus"></use></svg>
                            </button>
                        </span>

                        <!-- Champ de saisie de la quantité -->
                        <input type="text" name="quantity" class="form-control input-number quantity" value="1" style="width: 60px;">


                        <!-- Bouton pour augmenter la quantité -->
                        <span class="input-group-btn">
                            <button type="button" class="quantity-right-plus btn btn-success btn-number" data-type="plus">
                                <svg width="16" height="16"><use xlink:href="#plus"></use></svg>
                            </button>
                        </span>
                    </div>
                    <!-- Bouton "Ajouter au panier" -->
                    <a href="#" class="nav-link add-to-cart">Add to Cart <svg width="18" height="18"><use xlink:href="#cart"></use></svg></a>
                </div>
            </div>`;

            // Ajouter des boutons d'augmentation et de diminution de la quantité de produit
            let quantityInput = productDiv.querySelector('.quantity');
            let plusButton = productDiv.querySelector('.quantity-right-plus');
            let minusButton = productDiv.querySelector('.quantity-left-minus');
    
            if (quantityInput && plusButton && minusButton) {
                plusButton.addEventListener('click', function() {
                    console.log('Plus button clicked');
                    quantityInput.value = parseInt(quantityInput.value, 10) + 1;
                });
    
                minusButton.addEventListener('click', function() {
                    console.log('Minus button clicked');
                    if (parseInt(quantityInput.value, 10) > 1) {
                        quantityInput.value = parseInt(quantityInput.value, 10) - 1;
                    }
                });
            } else {
                console.error('One or more elements not found. Check your selectors.');
            }


        // Ajout du produit au conteneur des produits
        produitsList.appendChild(productDiv);

        // 添加事件委托，捕获所有"Add to Cart"按钮的点击事件
        produitsList.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart')) {
                event.preventDefault();
                addToCart(productDiv);
            }
        });

        // add to list de course
         document.getElementById('addToFavorite').addEventListener('click', function () {
        // obtenir list de course
        var selectedList = document.getElementById('favoriteList').value;

        // TODO: faire lien avec back end
        console.log('Product added to favorite list: ' + selectedList);

        // close
        var favoriteModal = new bootstrap.Modal(document.getElementById('favoriteModal'));
        favoriteModal.hide();
    });
    });



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



//  liste_course/codec 
loadDataWithNoCallback("liste_course/1")
    .then((p) => {
        console.log(p);
        updateListecourseDOM(p);
    }) 
    .catch(error => {
        console.error('Une erreur :', error);
    });


    function updateListecourseDOM(listCourses) {
        var favoriteListSelect = document.getElementById('favoriteList');
        
        if (!favoriteListSelect) {
            console.error('favoriteList element not found.');
            return; // SI NO. RETURN DIRECTEMENT
        }
    
        console.log(listCourses);
        console.log("check");
    
        favoriteListSelect.innerHTML = '';
    
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.text = "choisiez...";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        favoriteListSelect.appendChild(defaultOption);
    
        listCourses.forEach(item => {
            console.log(item);
            console.log("check");
    
            const option = document.createElement('option');
            option.value = item;
            option.text = item;
            favoriteListSelect.appendChild(option);
        });
    }