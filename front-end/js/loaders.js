//recuperation des données d une route d l'api
export function loadData(endpoint, callback) {
    fetch('http://localhost:8080/v1/' + endpoint)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Convertir la réponse en texte brut
      })
      .then(text => {
        console.log('Contenu de la réponse en texte brut :', text);
        if (!text) {
          throw new Error('Empty response text');
        }
        const data = JSON.parse(text);
        callback(data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
      });
}

