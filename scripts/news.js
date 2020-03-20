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

function ajouter_recherche() {
  var val = zone_saisie.value;
  //si la recherche n'existe pas
  if (recherches.indexOf(val) == -1) {
    recherches.push(val);
    recherchesstockees.innerHTML += '<p class="titre-recherche"><label>' + val + '</label><img src="img/croix30.jpg" class="icone-croix"/></p>';
    for (var i = 0; i < titrerecherche.length; i++) {
      // ajout des evenements
      titrerecherche[i].setAttribute("onclick", "selectionner_recherche(this)");
      iconecroix[i].setAttribute("onclick", "supprimer_recherche(this)");
    }
    var etat = toJSON();
    localStorage.setItem("recherches",etat);
    var monobjet_json = localStorage.getItem("recherches");
    var monobjet = JSON.parse(monobjet_json);
    // Affichage dans la console
    console.log(monobjet);
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

  // Réinitialisation de la zone de zone_saisie
  zone_saisie.value = "";
}


function selectionner_recherche(elt) {
  zone_saisie.value = elt.textContent;
  recherche_courante = elt.textContent;
}


function init() {
	//TODO ...
}


function rechercher_nouvelles() {
	//TODO ...
}


function maj_resultats(res) {
	//TODO ...
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
  json = {"recherches": recherches};
  json = JSON.stringify(json);

  return json;
}
