import { loadDataWithNoCallback } from "./loaders.js";

// Création d'un nouvel objet URLSearchParams avec la chaîne de requête de l'URL actuelle
const params = new URLSearchParams(window.location.search);

// Récupération de la valeur d'un paramètre spécifique
const listeId = params.get('listeId');

let allPostits = []

let allProducts = []

loadDataWithNoCallback(`listeCourses/${listeId}`)
    .then((liste) => {
        let listeTitle = document.getElementById('listeTitle')
        listeTitle.textContent = liste.nomLC
    })
    .catch(error => {
        // Gérer les erreurs ici
        console.error('Une erreur est survenue lors du chargement des produits :', error);
    });

loadDataWithNoCallback(`products/productsListeCourse/${listeId}`)
    .then((produits) => {
        allProducts = produits
        updateListProductsDom(produits)
    })
    .catch(error => {
        // Gérer les erreurs ici
        console.error('Une erreur est survenue lors du chargement des produits :', error);
    });

loadDataWithNoCallback(`postIt/postItsListeCourse/${listeId}`)
    .then((postIts) => {
        allPostits = postIts
        updateListPostItsDom(postIts)
    })
    .catch(error => {
        // Gérer les erreurs ici
        console.error('Une erreur est survenue lors du chargement des produits :', error);
    });


    function updateListProductsDom(produits) {
        let tbody = document.getElementById('productListItems')

        tbody.innerHTML = ''

        if (produits.length === 0) {
            let productInfos = document.createElement('tr')
            productInfos.innerHTML = `
            <h1>Aucun produit dans cette liste</h1>
            `
            tbody.appendChild(productInfos)
        } else {
            produits.forEach(product => {
            let productInfos = document.createElement('tr')

            productInfos.innerHTML = `
                <td scope="row" class="py-4">
                    <div class="cart-info d-flex flex-wrap align-items-center mb-4">
                    <div class="col-lg-3">
                        <div class="card-image">
                        <img src="http://localhost:8080/static/images/${product.productImage}" alt="${product.nomP}" class="img-fluid">
                        </div>
                    </div>
                    <div class="col-lg-9">
                        <div class="card-detail ps-3">
                        <h5 class="card-title">
                            <a href="single-product.html?productId=${product.codeP}" class="text-decoration-none">${product.nomP}</a>
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
                    <input type="text" name="quantity" class="form-control input-number text-center quantity"
                        value="1">
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
                    <span class="money text-dark">${product.prixP} €</span>
                    </div>
                </td>
                <td class="py-4">
                    <div class="cart-remove">
                    <a class="btn-supp-product" data-bs-toggle="modal" data-bs-target="#suppProductModal" data-product-id="${product.codeP}" data-product-name="${product.nomP}">
                        <svg width="24" height="24">
                        <use xlink:href="#trash"></use>
                        </svg>
                    </a>
                    </div>
                </td>
                
            `
            tbody.appendChild(productInfos)

            // Ajouter des boutons d'augmentation et de diminution de la quantité de produit
            let quantityInput = productInfos.querySelector('.quantity');
            let plusButton = productInfos.querySelector('.quantity-right-plus');
            let minusButton = productInfos.querySelector('.quantity-left-minus');
        
        
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
        });
        
        }

        let modalProductDeleteDiv = document.createElement('div');

        // Ajout des classes à l'élément div
        modalProductDeleteDiv.classList.add('modal', 'fade');
        modalProductDeleteDiv.id = 'suppProductModal';
        modalProductDeleteDiv.tabIndex = '-1';
        modalProductDeleteDiv.setAttribute('aria-labelledby', 'suppProductModalLabel');
        modalProductDeleteDiv.setAttribute('aria-hidden', 'true');

        modalProductDeleteDiv.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Confirmation</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary supp-product-button">Supprimer</button>
                </div>
            </div>
        </div>
        `

        tbody.appendChild(modalProductDeleteDiv)

        // Récupérer le bouton de suppression
        let aLinks = document.querySelectorAll('.btn-supp-product');

        // Ajouter un écouteur d'événements à chaque bouton
        aLinks.forEach(a => {
                a.addEventListener('click', function(event) {
                // Récupérer l'ID du produit à partir de l'attribut data
                let productId = this.getAttribute('data-product-id');
                let productName = this.getAttribute('data-product-name');

                // Mettre à jour le contenu du modal avec l'ID du produit
                let modalBody = document.querySelector('#suppProductModal .modal-body');
                modalBody.textContent = 'Êtes-vous sûr de vouloir supprimer le produit ' + productName + '?';

                let modalSuppBtn = document.querySelector('#suppProductModal .supp-product-button');
                modalSuppBtn.setAttribute("data-product-id", productId)
            });
        });

        // Sélectionner le bouton "Supprimer" dans le pop-up
        let supprimerButton = document.querySelector('.supp-product-button');

        // Ajouter un écouteur d'événements au clic sur le bouton "Supprimer"
        supprimerButton.addEventListener('click', function(event) {
        let productId = this.getAttribute('data-product-id');

        let listeCourseData = {
            codeLC: listeId
          };

        let productData = {
            codeP: productId
          };

        let requestBody = {
            listeCourse: listeCourseData,
            produit: productData
          };

        // Effectuer l'appel POST à l'API
        fetch(`http://localhost:8080/v1/products`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })
        .then(response => {
          if (!response.ok) {
              throw new Error('Erreur lors de la création de la liste.');
          }
          return response.json();
        })
        .then(data => {
          // Traitement de la réponse de l'API si nécessaire
          console.log('Post it supprimé avec succès :', data);
          let indexToRemove = allProducts.findIndex(product => product.codeP === data.codeP);
          if (indexToRemove !== -1) {
                allProducts.splice(indexToRemove, 1);
          }
          console.log(allProducts)
          updateListProductsDom(allProducts);
          // Fermer le pop-up après avoir effectué l'action
          let bootstrapModal = bootstrap.Modal.getInstance(modalProductDeleteDiv);
          bootstrapModal.hide();
        })
        .catch(error => {
          console.error('Erreur :', error);
        });

     });
        


        

       

    }

    function updateListPostItsDom(postIts) {
        let parentNode = document.getElementById('postListItems')

        postListItems.innerHTML = ''


        postIts.forEach(postIt => {
            let postItInfos = document.createElement('div')
            postItInfos.classList.add('col')

            postItInfos.innerHTML = `
            <div class="product-item">
                <a class="btn-wishlist" data-bs-toggle="modal" data-bs-target="#suppPostModal" data-postIt-id="${postIt.codePostIt}" data-postIt-name="${postIt.nomPostIt}"><svg width="24" height="24"><use xlink:href="#trash"></use></svg></a>
                <figure>
                    <img src="images/post-it.jpg" alt="${postIt.nomPostIt}" class="tab-image">
                    </a>
                </figure>
                <h3>${postIt.nomPostIt}</h3>
            </div>
                
            `
            parentNode.appendChild(postItInfos)
        });

        let addPostItElement = document.createElement('div');
        addPostItElement.classList.add("col");
        
        addPostItElement.innerHTML = `
        <div class="product-item d-flex justify-content-center align-items-center flex-column">
            <span class="badge bg-dark mt-2" style="font-size: 25px; background-color: red;">Nouveau</span>
            <figure>
                <img src="images/post-it.jpg" alt="Product Thumbnail" class="tab-image">
                </a>
            </figure>
            <h3 class="text-center">Nouveau Post-its</h3>
            <a type="button" class="btn btn-dark rounded-pill mt-2" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                Créer
            </a>
            <div class="collapse mt-3" id="collapseExample">
                <div class="card card-body">
                    <form id="creerPostIt" class="d-flex justify-content-center align-items-center flex-column">
                        <label for="product-name">Nom du post it :</label>
                        <input type="text" id="postIt-name" name="product-name" required>
                        <label for="product-quantity">Quantité :</label>
                        <input type="number" id="product-quantity" name="product-quantity" value="1" required>
                        <button type="submit" class="btn btn-success rounded-pill mt-3">Créer</button>
                    </form>
                </div>
                </div>
        </div>
        `

        parentNode.appendChild(addPostItElement)

        let formListCourse = document.getElementById('creerPostIt')

      formListCourse.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêcher le comportement par défaut du formulaire (rechargement de la page)

        // Récupérer la valeur de l'input
        let postitNameInput = document.getElementById('postIt-name');
        let postitName = postitNameInput.value;

        // Vérifier si l'input est vide
        if (postitName.trim() === '') {
            alert('Veuillez entrer un nom pour la liste.');
            return; // Arrêter l'exécution de la fonction
        }

        // Données sur le client
        let listCourseData = {
          codeLC: listeId // Exemple de code client
        };

        // Création de l'objet à envoyer dans le corps de la requête
        let requestBody = {
          nomPostIt: postitName.trim(),
          listeCourse: listCourseData
        };

        console.log(requestBody);

        // Effectuer l'appel POST à l'API
        fetch('http://localhost:8080/v1/postIt', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })
        .then(response => {
          if (!response.ok) {
              throw new Error('Erreur lors de la création de la liste.');
          }
          return response.json();
        })
        .then(data => {
          // Traitement de la réponse de l'API si nécessaire
          console.log('Post it créée avec succès :', data);
          allPostits.push(data);
          updateListPostItsDom(allPostits);
        })
        .catch(error => {
          console.error('Erreur :', error);
        });

      });

        let modalPostitDeleteDiv = document.createElement('div');

        // Ajout des classes à l'élément div
        modalPostitDeleteDiv.classList.add('modal', 'fade');
        modalPostitDeleteDiv.id = 'suppPostModal';
        modalPostitDeleteDiv.tabIndex = '-1';
        modalPostitDeleteDiv.setAttribute('aria-labelledby', 'suppPostModalLabel');
        modalPostitDeleteDiv.setAttribute('aria-hidden', 'true');

        modalPostitDeleteDiv.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Confirmation</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary supp-postit-button">Supprimer</button>
                </div>
            </div>
        </div>
        `

        parentNode.appendChild(modalPostitDeleteDiv)

        // Récupérer le bouton de suppression
        let aLinks = document.querySelectorAll('.btn-wishlist');

        // Ajouter un écouteur d'événements à chaque bouton
        aLinks.forEach(a => {
            a.addEventListener('click', function(event) {
                // Récupérer l'ID du produit à partir de l'attribut data
                let postitId = this.getAttribute('data-postIt-id');
                let postitName = this.getAttribute('data-postIt-name');

                // Mettre à jour le contenu du modal avec l'ID du produit
                let modalBody = document.querySelector('#suppPostModal .modal-body');
                modalBody.textContent = 'Êtes-vous sûr de vouloir supprimer le postIt ' + postitName + '?';

                let modalSuppBtn = document.querySelector('#suppPostModal .supp-postit-button');
                modalSuppBtn.setAttribute("data-postIt-id", postitId)
            });
        });

        // Sélectionner le bouton "Supprimer" dans le pop-up
        let supprimerButton = document.querySelector('.supp-postit-button');

        // Ajouter un écouteur d'événements au clic sur le bouton "Supprimer"
        supprimerButton.addEventListener('click', function(event) {
        let postitId = this.getAttribute('data-postIt-id');

        // Effectuer l'appel POST à l'API
        fetch(`http://localhost:8080/v1/postIt/${postitId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (!response.ok) {
              throw new Error('Erreur lors de la création de la liste.');
          }
          return response.json();
        })
        .then(data => {
          // Traitement de la réponse de l'API si nécessaire
          console.log('Post it supprimé avec succès :', data);
          let indexToRemove = allPostits.findIndex(postit => postit.codePostIt === data.codePostIt);
          if (indexToRemove !== -1) {
                allPostits.splice(indexToRemove, 1);
          }
          console.log(allPostits)
          updateListPostItsDom(allPostits);
          // Fermer le pop-up après avoir effectué l'action
          let bootstrapModal = bootstrap.Modal.getInstance(modalPostitDeleteDiv);
          bootstrapModal.hide();
        })
        .catch(error => {
          console.error('Erreur :', error);
        });

     });


    }
    


