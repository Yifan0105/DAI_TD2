import { loadDataWithNoCallback } from './loaders.js';

document.addEventListener('DOMContentLoaded', function() {


});



let allListes = []

loadDataWithNoCallback("listeCourses")
    .then((listes) => {
        // Utiliser les données récupérées
        allListes = listes
        updateListeCourseDom(listes)
    }) 
    .catch(error => {
        // Gérer les erreurs ici
        console.error('Une erreur est survenue lors du chargement des produits :', error);
    });
 

    function updateListeCourseDom(listes) {
        console.log(listes)
        let tbody = document.getElementById('listeCourseItems')

        tbody.innerHTML = ''

        if (listes.length === 0) {
          tbody.innerHTML = "<h1>Vous n'avez aucune liste</h1>"
        }


        listes.forEach(liste => {
            let listeInfos = document.createElement('tr')
            listeInfos.innerHTML = `          
                <td scope="row" class="py-4">
                  <div class="cart-info d-flex flex-wrap align-items-center mb-4">
                    <div class="col-lg-3">
                      <div class="card-image">
                        <img src="images/paniercourse.png" alt="cloth" class="img-fluid">
                      </div>
                    </div>
                    <div class="col-lg-9">
                      <div class="card-detail ps-3">
                        <h5 class="card-title">
                          <a href="listeex.html?listeId=${liste.codeLC}" class="text-decoration-none">${liste.nomLC}</a>
                        </h5>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <div class="cart-remove">
                    <a>
                      <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#ajoutPanierModal">Ajouter au panier</button>
                    </a>  
                  </div>
                </td>
                <td class="py-4">
                  <div class="cart-remove">
                    <a href="listeex.html?listeId=${liste.codeLC}">
                      <button type="button" class="btn btn-primary">consulter la liste</button>
                    </a>  
                  </div>
                </td>  
                
                <td class="py-4">
                  <!-- Button trigger modal -->
                  <button type="button" class="btn btn-outline-danger btn-supp-list-modal" data-bs-toggle="modal" data-bs-target="#suppListeModal" data-liste-id="${liste.codeLC}" data-liste-name="${liste.nomLC}">
                    <svg width="24" height="24">
                      <use xlink:href="#trash"></use>
                    </svg>
                  </button>
                </td>
            `
            tbody.appendChild(listeInfos)
        });

        let addButton = document.createElement('tr');
        addButton.innerHTML = `
            <td scope="row" class="py-4">
            <p class="d-inline-flex gap-1">
                <a class="btn btn-secondary w-100 btn-lg" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                Créer une nouvelle liste
                </a>
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                <form id="creerListe">
                    <label for="list-name">Nom de la liste :</label>
                    <input type="text" id="list-name" name="list-name" required>
                    <button type="submit" class="btn btn-success rounded-pill">Créer</button>
                </form>
                </div>
            </div>
            </td> 
        `
        tbody.appendChild(addButton)

        let modalListeDeleteDiv = document.createElement('div');

        // Ajout des classes à l'élément div
        modalListeDeleteDiv.classList.add('modal', 'fade');
        modalListeDeleteDiv.id = 'suppListeModal';
        modalListeDeleteDiv.tabIndex = '-1';
        modalListeDeleteDiv.setAttribute('aria-labelledby', 'suppListeModalLabel');
        modalListeDeleteDiv.setAttribute('aria-hidden', 'true');

        modalListeDeleteDiv.innerHTML = `
        <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Confirmation</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    Etes vous certains de vouloir supprimer la liste de course <span id="listeCourseName"></span>?
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary supp-liste-button">Supprimer</button>
                  </div>
              </div>
        </div>
        `
        tbody.appendChild(modalListeDeleteDiv)

        // Récupérer le bouton de suppression
        let btns = document.querySelectorAll('.btn-supp-list-modal');

        // Ajouter un écouteur d'événements à chaque bouton
        btns.forEach(btn => {
                btn.addEventListener('click', function(event) {
                // Récupérer l'ID du produit à partir de l'attribut data
                let listeId = this.getAttribute('data-liste-id');
                let listeName = this.getAttribute('data-liste-name');

                // Mettre à jour le contenu du modal avec l'ID du produit
                let spanListeName = document.getElementById('listeCourseName');
                spanListeName.textContent = listeName;

                let modalSuppBtn = document.querySelector('#suppListeModal .supp-liste-button');
                modalSuppBtn.setAttribute("data-liste-id", listeId)
            });
        });

        // Sélectionner le bouton "Supprimer" dans le pop-up
        let supprimerButton = document.querySelector('.supp-liste-button');

        // Ajouter un écouteur d'événements au clic sur le bouton "Supprimer"
        supprimerButton.addEventListener('click', function(event) {
        let listeId = this.getAttribute('data-liste-id');

        
        // Effectuer l'appel POST à l'API
        fetch(`http://localhost:8080/v1/listeCourses/${listeId}`, {
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
          let indexToRemove = allListes.findIndex(liste => liste.codeLC === data.codeLC);
          if (indexToRemove !== -1) {
                allListes.splice(indexToRemove, 1);
          }
          updateListeCourseDom(allListes);
          // Fermer le pop-up après avoir effectué l'action
          let bootstrapModal = bootstrap.Modal.getInstance(modalListeDeleteDiv);
          bootstrapModal.hide();
        })
        .catch(error => {
          console.error('Erreur :', error);
        });

     });



        let formListCourse = document.getElementById('creerListe')

      formListCourse.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêcher le comportement par défaut du formulaire (rechargement de la page)

        // Récupérer la valeur de l'input
        let listNameInput = document.getElementById('list-name');
        let listName = listNameInput.value;

        // Vérifier si l'input est vide
        if (listName.trim() === '') {
            alert('Veuillez entrer un nom pour la liste.');
            return; // Arrêter l'exécution de la fonction
        }

        // Données sur le client
        let clientData = {
          codeClient: 1 // Exemple de code client
        };

        // Création de l'objet à envoyer dans le corps de la requête
        let requestBody = {
          nomLC: listName,
          client: clientData
        };

        console.log(requestBody);

        // Effectuer l'appel POST à l'API
        fetch('http://localhost:8080/v1/listeCourses', {
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
          console.log('Liste créée avec succès :', data);
          allListes.push(data);
          updateListeCourseDom(allListes);
        })
        .catch(error => {
          console.error('Erreur :', error);
        });
      });
        
    }

  



    