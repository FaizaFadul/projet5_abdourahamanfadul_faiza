/* Affichage des produits sur la page produit et gestion de l'ajout au panier */

/* Récupération de l'id du produit */
const url = new URL(window.location.href);
const productID = url.searchParams.get("id");

/* Création d'une constante associée à l'élément addToCart */
const addToCartButton = document.getElementById("addToCart");

/* Mise en place de la classe d'objet associé aux données des produits */
class ProductData{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}

/* Gestion de la quantité lorsque l'utilisateur tape des valeurs hors intervalle 1-100 */
document.getElementById("quantity").addEventListener('change',function(){
    if (document.getElementById("quantity").value <= 0) {
        document.getElementById("quantity").value = 1;
    } else if (document.getElementById("quantity").value > 100) {
        document.getElementById("quantity").value = 100;
    }
})

/* Récupération des données associées à un produit unique et affichage sur la page produit*/
fetch(`http://localhost:3000/api/products/${productID}`)
    /* Récupération et verification des données associées au produit*/
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    /* Affichage sur la page produit */
    .then(function(data){
        let product = new ProductData(data);
        document.title = product.name;
        document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
        document.getElementById("title").innerText = product.name;
        document.getElementById("price").innerText = product.price;
        document.getElementById("description").innerText = product.description;
        for (let productColors of product.colors){
            document.getElementById("colors").innerHTML += ` <option value=${productColors}>${productColors}</option>`;
        }
        return data._id;
    })
    /* Gestion de l'ajout au panier */
    .then(function(productID){
        addToCartButton.addEventListener('click',function() {
            /* Comportement en cas d'absence de choix de couleur ou de quantité */
            if (!document.getElementById("colors").value){
                addToCartButton.textContent = "Veuillez choisir la couleur souhaitée"
            } else if (document.getElementById("quantity").value == 0){
                addToCartButton.textContent = "Veuillez choisir la quantité souhaitée"
            } else {
                /* Comportement lorsque le choix est bien défini */
                addToCartButton.textContent = "Ajouté"
                let productToBeStored = {
                    _id : productID,
                    color : document.getElementById("colors").value,
                    quantity : Number(quantity = document.getElementById("quantity").value),
                }
                let cartState = [];
                if (localStorage.length == 0){
                    /* Lorsque aucun produit n'a été ajouté auparavant */
                    cartState = [productToBeStored];
                } else {
                    cartState = JSON.parse(localStorage.getItem("storedProduct"));
                    let prodIndex = cartState.findIndex((prod) => prod._id == productToBeStored._id  && prod.color == productToBeStored.color);
                    if (prodIndex == -1){
                        /* Lorsque le produit actuel n'a jamais été ajouté */
                        cartState.push(productToBeStored);
                    } else {
                        /* Lorsque le produit est déjà présent dans le cart*/
                        if (cartState[prodIndex].quantity + productToBeStored.quantity > 100) {
                            /* Si le client essaie d'ajouter une quantité qui fait dépasser la limite de 100 unités */
                            let sum = cartState[prodIndex].quantity + productToBeStored.quantity;
                            cartState[prodIndex].quantity = 100;
                            window.alert(`Cet ajout amènerait la quantité à ${sum}. Les commandes étant limitées à 100 unités par canapé, la quantité a été automatiquement ramenée à 100.`);
                        } else {
                            cartState[prodIndex].quantity += productToBeStored.quantity;
                        }
                    }
                }
            localStorage.setItem("storedProduct",JSON.stringify(cartState));
        }
    });
        /* Retour au texte de base du bouton ajouter au panier */
        document.getElementById("colors").addEventListener('change',function(){
            addToCartButton.textContent = "Ajouter au panier"
        });
        document.getElementById("quantity").addEventListener('change',function(){
            addToCartButton.textContent = "Ajouter au panier"
        });
    })
    .catch(function(err){
        console.log("Aucune idée de ce à quoi ressemble le produit");
    });