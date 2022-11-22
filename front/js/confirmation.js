/* Affichage du numéro de commande sur la page confirmation */

/* Récupération de l'id de la commande */
let url = new URL(window.location.href);
let orderID = url.searchParams.get("id");

/* Ajout du numéro de commande */
document.getElementById("orderId").textContent = `${orderID}`;

/* Suppression du localStorage */
localStorage.clear();