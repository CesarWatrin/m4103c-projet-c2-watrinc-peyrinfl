// Tableau contenant des chaines de caractères correspondant aux recherches stockées
var recherches = [];
// Chaine de caractères correspondant à la recherche courante
var recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
var recherche_courante_news = [];
// Variables diverses
var zone_saisie=document.getElementById("zone_saisie");
var recherchesstockees=document.getElementById("recherches-stockees");
var titrerecherche=document.getElementsByClassName("titre-recherche");
var iconecroix=document.getElementsByClassName("icone-croix");
var div_resultats = document.getElementById("resultats");
var div_wait = document.getElementById("wait");
var nb = 0;

function ajouter_recherche() {
  var val = zone_saisie.value;
  //si la recherche n'existe pas
  if (recherches.indexOf(val) == -1 && val != "") {
    recherches.push(val);
    recherchesstockees.innerHTML += '<p class="titre-recherche"><label>' + val + '</label><img src="img/croix30.jpg" class="icone-croix"/></p>';
    nb++;
    for (var i = 0; i < titrerecherche.length; i++) {
      // ajout des evenements
      titrerecherche[i].setAttribute("onclick", "selectionner_recherche(this)");
      iconecroix[i].setAttribute("onclick", "supprimer_recherche(this)");
    }
    var etat = toJSON();
    localStorage.setItem("recherches",etat);
  }
}

function supprimer_recherche(elt) {
  // Suppresion de l'élement html correspondant à la recherche
	var parent = elt.parentElement;
  var upParent = parent.parentElement;
  upParent.removeChild(parent);

  // Suppression de l'élement dans le tableau de recherche
  var ind = recherches.indexOf(elt);
  recherches.splice(ind, 1);

  nb--;
  var etat = toJSON();
  localStorage.setItem("recherches",etat);
}


function selectionner_recherche(elt) {
  zone_saisie.value = elt.textContent;
  recherche_courante = elt.textContent;
}


function init() {
  var mesRecherches = localStorage.getItem("recherches");
  var object = JSON.parse(mesRecherches);
  nb += object.nombre;
  for (var i = 0; i < object.nombre; i++) {
      recherchesstockees.innerHTML += '<p class="titre-recherche"><label>' + object.recherches[i].val + '</label><img src="img/croix30.jpg" class="icone-croix"/></p>';
      titrerecherche[i].setAttribute("onclick", "selectionner_recherche(this)");
      iconecroix[i].setAttribute("onclick", "supprimer_recherche(this)");
  }
}


function rechercher_nouvelles() {
  div_resultats.innerHTML = "";

  div_wait.style.display = "block";

  var res = zone_saisie.value;
  res = encodeURIComponent(res);

  // xhr.open("GET", "calcul-serveur.php?data=" + resultat, true);
  // xhr.send(null);
  
}


function maj_resultats(res) {
  var div_wait = document.getElementById("wait");
  div_wait.style.display = "none";

  for (var i = 0; i < res.length; i++) {
    div_resultats.innerHTML += '<p class="titre_result"><a class="titre_news" href="'res.url'" target="_blank">'+ res.titre + '</a><span class="date_news">'+ res.date + '</span><span class="action_news" onclick="sauver_nouvelle(this)"><img src="images/horloge15.jpg"/></span></p>'
  }
}


function sauver_nouvelle(elt) {
	//TODO ...
}


function supprimer_nouvelle(elt) {
	//TODO ...
}

function toJSON() {
  var json = {};
  var recherches = [];

  for (var i = 0; i < titrerecherche.length; i++) {
		var j = i + 1;
		var recherche = new Object();
    recherche.id = "recherche" + j;
    recherche.val = titrerecherche[i].textContent;
    recherches.push(recherche);
		j++;
  }
  json = {"recherches": recherches, "nombre": nb};
  json = JSON.stringify(json);

  return json;
}

function ajax_get_request(callback, url, async) {
  // Instanciation d'un objet XHR
  var xhr = new XMLHttpRequest();

  // Définition de la fonction à exécuter à chaque changement d'état
  xhr.onreadystatechange = function(){
    /* readyState permet de connaître l'état de la requête :
      => 0: L'objet XHR a été créé, mais pas encore initialisé
      => 1: L'objet XHR a été créé, mais pas encore envoyé
      => 2: La méthode send vient d'être appelée
      => 3: Le serveur traite les informations et a commencé à renvoyer des données
      => 4: Le serveur a fini son travail, et toutes les données sont réceptionnées
    */
    if (callback && xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
      // Si une fonction callback est définie + que le serveur a fini son travail
      // + que le code d'état indique que tout s'est bien passé
      // => On appelle la fonction callback en passant en paramètre
      //		les données récupérées sous forme de texte brut
      callback(xhr.responseText);
    }
  };
