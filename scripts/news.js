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
var action_news = document.getElementsByClassName('action_news')
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
  // Suppression de l'élement html correspondant à la recherche
	var parent = elt.parentElement;
  var upParent = parent.parentElement;
  upParent.removeChild(parent);

  // Suppression de l'élement dans le tableau de recherches et dans le localStorage
  var ind = recherches.indexOf(elt);
  recherches.splice(ind, 1);
  nb--;
  var etat = toJSON();
  if (recherches!=0) {
    localStorage.setItem("recherches",etat);
  } else {
    localStorage.removeItem("recherches");
  }
  // localStorage.setItem("recherches",etat);
}

function selectionner_recherche(elt) {
  zone_saisie.value = elt.textContent;
  recherche_courante = elt.textContent;

  var offres = JSON.parse(localStorage.getItem(zone_saisie.value));

  //on vide les résultats actuels
  div_resultats.innerHTML = "";
  // Récupération de l'objet recherche associé à la recherche
  if (offres!=null) {
    for (var i = 0; i < offres.recherche_courante_news.length; i++) {
      div_resultats.innerHTML += '<p class="titre_result"><a class="titre_news" href="'+ offres.recherche_courante_news[i].url + '" target="_blank">'+ offres.recherche_courante_news[i].titre + '</a><span class="date_news">'+ offres.recherche_courante_news[i].date + '</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>';
    }
  }
}

function init() {
  var mesRecherches = localStorage.getItem("recherches");
  var object = JSON.parse(mesRecherches);
  var nbTemp = 0;
  try {
    nbTemp = object.nombre;
  } catch (err) {
    ; //do nothing
  } finally {
    nb += nbTemp;
  }
  for (var i = 0; i < nb; i++) {
      recherchesstockees.innerHTML += '<p class="titre-recherche"><label>' + object.recherches[i].val + '</label><img src="img/croix30.jpg" class="icone-croix"/></p>';
      titrerecherche[i].setAttribute("onclick", "selectionner_recherche(this)");
      iconecroix[i].setAttribute("onclick", "supprimer_recherche(this)");
      recherches.push(object.recherches[i].val);
  }
}

function rechercher_nouvelles() {
  div_resultats.innerHTML = "";
  div_wait.style.display = "block";

  var res = zone_saisie.value;
  res = encodeURIComponent(res);

  // xhr.open("GET", "calcul-serveur.php?data=" + resultat, true);
  // xhr.send(null);
  ajax_get_request(maj_resultats, "https://carl-vincent.fr/search-internships.php?data=" + res, true);

  var offres = JSON.parse(localStorage.getItem(zone_saisie.value));

  if (offres!=null) {
    for (var i = 0; i < offres.recherche_courante_news.length; i++) {
      recherche_courante_news.push(offres.recherche_courante_news[i]);
    }
  }
}

function maj_resultats(res) {
  div_wait.style.display = "none";
  var object = JSON.parse(res);

  for (var i = 0; i < object.length; i++) {
    if(eval(object[i])==true){
      div_resultats.innerHTML += '<p class="titre_result"><a class="titre_news" href="'+ object[i].url + '" target="_blank">'+ object[i].titre + '</a><span class="date_news">'+ formatDate(object[i].date) + '</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>';
    } else {
      div_resultats.innerHTML += '<p class="titre_result"><a class="titre_news" href="'+ object[i].url + '" target="_blank">'+ object[i].titre + '</a><span class="date_news">'+ formatDate(object[i].date) + '</span><span class="action_news" onclick="sauver_nouvelle(this)"><img src="img/horloge15.jpg"/></span></p>';
    }
  }
}

function eval(object) {
  for (var i = 0; i < recherche_courante_news.length; i++) {
    if (recherche_courante_news[i].titre==decodeHtmlEntities(object.titre)) {
      return true;
    }
  }
  return false;
}

function sauver_nouvelle(elt) {
    var parent = elt.parentNode;
    elt.setAttribute("onclick", "supprimer_nouvelle(this)");
    elt.firstChild.setAttribute("src","img/disk15.jpg");
    var offre = new Object();
    offre.titre = parent.querySelector(".titre_news").textContent;
    offre.date = parent.querySelector(".date_news").textContent;
    offre.url = parent.querySelector(".titre_news").getAttribute("href");
    if (indexOfResultat(recherche_courante_news,offre)==-1) {
      recherche_courante_news.push(offre);
      var json = {recherche_courante_news};
      json = JSON.stringify(json);
      localStorage.setItem(zone_saisie.value,json);
    }
}

function supprimer_nouvelle(elt) {
  var parent = elt.parentNode;
  elt.setAttribute("onclick", "sauver_nouvelle(this)");
  elt.firstChild.setAttribute("src","img/horloge15.jpg");
  var offre = new Object();
  offre.titre = parent.querySelector(".titre_news").textContent;
  offre.date = parent.querySelector(".date_news").textContent;
  offre.url = parent.querySelector(".titre_news").getAttribute("href");
  var index = indexOfResultat(recherche_courante_news,offre);
  if(index!=-1){
    recherche_courante_news.splice(index,1);
    var json = {recherche_courante_news};
    json = JSON.stringify(json);
    if (recherche_courante_news!=0) {
      localStorage.setItem(zone_saisie.value,json);
    } else {
      localStorage.removeItem(zone_saisie.value);
    }
  }
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
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (callback && xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
      callback(xhr.responseText);
    }
  };
  xhr.open("GET", url, async);
  xhr.send();
}

//Appuyer sur entrer pour rechercher
$(document).keypress(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13' && zone_saisie.value != "") {
                    rechercher_nouvelles();
                }
});
