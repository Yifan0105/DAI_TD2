import { loadData } from './loaders.js';


document.addEventListener('DOMContentLoaded', function() {
    // Mettez vos appels de méthodes ici
    loadData("categories", updateCategoriesDOM);
    loadData("rayons", updateRayonsDOM);
    
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
