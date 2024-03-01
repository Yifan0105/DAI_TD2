//recuperation des données d une route d l'api pour mettre à jour le dom
export function loadData(endpoint, callback) {
    fetch('http://localhost:8080/v1/' + endpoint)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Convertir la réponse en texte brut
      })
      .then(text => {
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

//recuperation des données d une route d l'api
export async function loadDataWithNoCallback(endpoint) {
  try {
      const response = await fetch('http://localhost:8080/v1/' + endpoint);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const text = await response.text();
      if (!text) {
          throw new Error('Empty response text');
      }
      const data = JSON.parse(text);
      return data;
  } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      // Renvoyer une promesse rejetée avec l'erreur
      return Promise.reject(error);
  }
}


