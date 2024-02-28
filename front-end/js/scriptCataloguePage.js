import { loadData } from './loaders.js';


document.addEventListener('DOMContentLoaded', function() {
    // Mettez vos appels de méthodes ici
    loadData("categories", updateCategoriesDOM);
    loadData("rayons", updateRayonsDOM);
    loadData("products", updateProductsDOM);
    
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
        link.href = '#'; // Vous pouvez définir le lien réel ici si nécessaire
        link.textContent = category.nomC; // Supposons que le nom de la catégorie est stocké dans la propriété "name"
  
        // Ajout du lien à l'élément <li>
        listItem.appendChild(link);
  
        // Ajout de l'élément <li> à la liste des catégories
        categoriesList.appendChild(listItem);
    })
}

// Fonction pour mettre à jour le DOM avec les catégories
function updateRayonsDOM(rayons) {
    
    let rayonsList = document.getElementById('rayonsList');

    rayons.forEach(category => {
        // Création d'un nouvel élément <li> pour chaque catégorie
        var listItem = document.createElement('li');
        listItem.classList.add('rayon-item');
  
        // Création d'un nouvel élément <a> pour le lien de la catégorie
        var link = document.createElement('a');
        link.href = '#'; // Vous pouvez définir le lien réel ici si nécessaire
        link.textContent = category.nomR; // Supposons que le nom de la catégorie est stocké dans la propriété "name"
  
        // Ajout du lien à l'élément <li>
        listItem.appendChild(link);
  
        // Ajout de l'élément <li> à la liste des catégories
        rayonsList.appendChild(listItem);
    })
}

function updateProductsDOM(produits) {

    let produitsList = document.getElementById('productsList');

    // Nettoyer le contenu existant
    produitsList.innerHTML = '';

    produits.forEach(product => {
        // Création d'un nouvel élément <div> pour chaque produit
        let productDiv = document.createElement('div');
        productDiv.classList.add('col');
        productDiv.innerHTML = `
            <div class="product-item">
                <!-- Bouton pour ajouter aux favoris -->
                <a href="#" class="btn-wishlist"><svg width="24" height="24"><use xlink:href="#heart"></use></svg></a>

                <!-- Image du produit -->
                <figure>
                    <a href="single-product.html?pro=${product.codeP}" title="${product.nomP}">
                        <img src="http://localhost:8080/static/images/${product.productImage}" alt="Product Image" class="tab-image">
                    </a>
                </figure>

                <!-- Titre, quantité, évaluation, prix du produit -->
                <h3>${product.nomP}</h3>
                <span class="qty">1 Unité</span><span class="rating"><svg width="24" height="24" class="text-primary"><use xlink:href="#star-solid"></use></svg> 4.5</span>
                <span class="price">$${product.prixP}</span>

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
                        <input type="text" name="quantity" class="form-control input-number quantity" value="1">

                        <!-- Bouton pour augmenter la quantité -->
                        <span class="input-group-btn">
                            <button type="button" class="quantity-right-plus btn btn-success btn-number" data-type="plus">
                                <svg width="16" height="16"><use xlink:href="#plus"></use></svg>
                            </button>
                        </span>
                    </div>
                    <!-- Bouton "Ajouter au panier" -->
                    <a href="#" class="nav-link">Add to Cart <svg width="18" height="18"><use xlink:href="#cart"></use></svg></a>
                </div>
            </div>`;

        // Ajout du produit au conteneur des produits
        produitsList.appendChild(productDiv);
    });


}