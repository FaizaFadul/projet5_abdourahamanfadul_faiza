/* Affichage des produits sur la page d'accueil */

/* Mise en place de la classe d'objet associé aux données des produits */
class ProductData{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}

/* Récupération des données associées aux produits et affichage sur la page d'accueil*/
fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(data){
        for (let jsonProduct of data){
            let product = new ProductData(jsonProduct);
            document.querySelector(".items").innerHTML +=
            `<a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`
        }
    })
    .catch(function(err){
        console.log("Cela ne marche pas");
    });

