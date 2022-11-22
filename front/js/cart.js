/* Affichage des produits sur la page panier */

/* Récupération des produits contenus dans le local storage */
let cart = JSON.parse(localStorage.getItem("storedProduct"));

/* Création des variables associées à la quantité totale de produit et au prix de la commande */
let totalQuantity = 0;
let totalPrice = 0;
let prices = [];

/* Mise en place de la classe d'objet associé aux données des produits */
class ProductData{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}



/* Affichage de chaque produit contenu dans le cart */
for (let productData of cart){
    fetch(`http://localhost:3000/api/products/${productData._id}`)
    /* Récupération et verification des données associées au produit */
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    /* Affichage des données du produit */
    .then(function(data){
        let product = new ProductData(data);
        document.getElementById("cart__items").innerHTML +=
        `<article class="cart__item" data-id="${productData._id}" data-color="${productData.color}">
            <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${productData.color}</p>
                <p>${product.price}</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : ${productData.quantity}</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${productData.quantity}>
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
        </article>`;

        /* Addition des quantités et des prix à chaque itération */
        totalQuantity += parseInt(productData.quantity);
        totalPrice += parseInt(product.price) * parseInt(productData.quantity);

        /* Mise à jour du tableau des prix à chaque itération */
        prices.push(product.price);

        /* Affichage de la quantité de produits et du prix de la commande */
        document.getElementById("totalQuantity").textContent = totalQuantity;
        document.getElementById("totalPrice").textContent = totalPrice;

        /* Comportement en cas de clic sur "supprimer" */
        document.querySelectorAll(".deleteItem").forEach(deleteProduct =>
            deleteProduct.addEventListener('click',function(){            
                let productId = this.closest("article").getAttribute('data-id');
                let productColor = this.closest("article").getAttribute('data-color');
                let prodIndex = cart.findIndex((prod) => prod._id == productId && prod.color == productColor);
                
                /* Mise à jour des prix */
                totalQuantity -= cart[prodIndex].quantity;
                totalPrice -= prices[prodIndex] * cart[prodIndex].quantity;
                document.getElementById("totalQuantity").textContent = totalQuantity;
                document.getElementById("totalPrice").textContent = totalPrice;

                /* Mise à jour du panier, du local storage et de l'affichage */
                cart.splice(prodIndex,1);
                localStorage.setItem("storedProduct",JSON.stringify(cart));
                this.closest("article").remove();
            })
        )

        /* Comportement en cas de changement de quantité */
        document.querySelectorAll(".itemQuantity").forEach(productQuantity =>
            productQuantity.addEventListener('change',function(){
                /* Réponse lorsque l'utilisateur tape des valeurs hors intervalle 1-100 */
                if (this.value <= 0 || this.value > 100) {
                    this.previousElementSibling.textContent = `Qté : Veuillez choisir une quantité entre 1 et 100`;
                } else /* Modifications lorsque l'utilisateur tape des valeurs dans l'intervalle 1-100 */{    
                let productId = this.closest("article").getAttribute('data-id');
                let productColor = this.closest("article").getAttribute('data-color');
                let prodIndex = cart.findIndex((prod) => prod._id == productId && prod.color == productColor);
                previousQuantity = cart[prodIndex].quantity;
                cart[prodIndex].quantity = Number(this.value);

                /* Mise à jour des prix */
                totalQuantity += cart[prodIndex].quantity - previousQuantity;
                totalPrice += prices[prodIndex] * (cart[prodIndex].quantity - previousQuantity);
                document.getElementById("totalQuantity").textContent = totalQuantity;
                document.getElementById("totalPrice").textContent = totalPrice;

                /* Mise à jour du local storage et de l'affichage */
                localStorage.setItem("storedProduct",JSON.stringify(cart));
                this.previousElementSibling.textContent = `Qté : ${cart[prodIndex].quantity}`;
                }
            })
        )

        
    })
    .catch(function(err){
        console.log("Cela ne marche pas");
    });
}

/* Gestion du formulaire de coordonnées */

/* Création de l'objet contact, de l'array products et récupération des données associées à l'objet contact */
let contact = {};
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
let products = cart.map(data => data._id);

/* Fonction de vérification de la syntaxe des noms (prénom, nom de famille, ville) */
function isNameValid(name){
    return /\b([A-ZÀ-ÿ][-,a-z. '][^0-9]+[ ]*$)+/gim.test(name);
}

/* Fonction de vérification de la syntaxe de l'adresse */
function isAddressValid(address){
    return /(\d{1,}) [a-zÀ-ÿA-Z0-9\s]+(\.)? [a-zÀ-ÿA-Z]+ ([0-9]{5})?/gim.test(address);
}

/* Fonction de vérification de la syntaxe de l'e-mail */
function isEmailValid(email){
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gim.test(email);
}

/* Comportement lors du click du bouton "commander" */
document.querySelector('.cart__order__form__submit #order').addEventListener('click', function(event){
    event.preventDefault();

    /* Vérification du formulaire et mise à jour de l'objet contact */
    if (!isNameValid(firstName.value)){
        document.getElementById('firstNameErrorMsg').textContent="Veuillez indiquer votre prénom";
    } else {
        document.getElementById('firstNameErrorMsg').textContent="";
        contact.firstName = firstName.value;
    }

    if (!isNameValid(lastName.value)){
        document.getElementById('lastNameErrorMsg').textContent="Veuillez indiquer votre nom de famille";
    } else {
        document.getElementById('lastNameErrorMsg').textContent="";
        contact.lastName = lastName.value;
    }

    if (!isAddressValid(address.value)){
        document.getElementById('addressErrorMsg').textContent="Veuillez indiquer une adresse valide";
    } else {
        document.getElementById('addressErrorMsg').textContent="";
        contact.address = address.value;
    }

    if (!isNameValid(city.value)){
        document.getElementById('cityErrorMsg').textContent="Veuillez indiquer le nom de votre ville";
    } else {
        document.getElementById('cityErrorMsg').textContent="";
        contact.city = city.value;
    }

    if (!isEmailValid(email.value)){
        document.getElementById('emailErrorMsg').textContent="Veuillez indiquer une adresse e-mail valide";
    } else {
        document.getElementById('emailErrorMsg').textContent="";
        contact.email = email.value;

        /* Création de l'objet qui sera envoyé à l'API */
        orderData = {contact,products};

        /* Envoi des données à l'API */
        fetch("http://localhost:3000/api/products/order", {
            method: 'POST',
            headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
            body: JSON.stringify(orderData)
        })

        /* Vérification de la réponse de l'API */
        .then(function(res) {
            if (res.ok) {
            return res.json();
            }
        })

        /* Ouverture de la page de confirmation de commande */
        .then(function(data) {
            window.location.replace(`./confirmation.html?id=${data.orderId}`)
        });
    }
})