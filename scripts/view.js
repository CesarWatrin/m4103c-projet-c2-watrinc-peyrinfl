var view = {};
view.get_zone_saisie = function() {
  return document.getElementById("zone_saisie");
}
view.get_zone_saisie_value = function() {
  return document.getElementById("zone_saisie").value;
}
view.get_recherchesstockees = function() {
  return document.getElementById("recherches-stockees");
}
view.get_titrerecherche = function() {
  return document.getElementsByClassName("titre-recherche");
}
view.get_iconecroix = function() {
  return document.getElementsByClassName("icone-croix");
}
view.get_div_resultats = function() {
  return document.getElementById("resultats");
}
view.get_action_news = function() {
  return document.getElementsByClassName('action_news');
}
view.get_div_wait = function() {
  return document.getElementById("wait");
}
view.get_titre = function() {
  return document.getElementsByClassName("titre");
}
view.ajouter_recherche_stockee = function(val) {
  var recherchesstockees = view.get_recherchesstockees();
  recherchesstockees.innerHTML += '<p class="titre-recherche"><label>' + val + '</label><img src="img/croix30.jpg" class="icone-croix"/></p>';
  for (var i = 0; i < view.get_titrerecherche().length; i++) {
     // Ajout des evenements
    view.get_titrerecherche()[i].setAttribute("onclick", "controler.selectionner_recherche(this)");
    view.get_iconecroix()[i].setAttribute("onclick", "controler.supprimer_recherche(this)");
  }
}
view.supprimer_element = function(elt) {
  var parent = elt.parentElement;
  var upParent = parent.parentElement;
  upParent.removeChild(parent);
}
view.set_zone_saisie = function(val) {
  view.get_zone_saisie().value = val;
}
view.reinitialisation_resultats = function() {
  view.get_div_resultats().innerHTML = "";
}
view.chargement = function() {
  view.get_div_wait().style.display = "block";
}
view.reprise = function() {
  view.get_div_wait().style.display = "none";
}
view.afficher_resultats = function(object) {
  for (var i = 0; i < object.length; i++) {
    if(view.eval(object[i])==true){
      view.get_div_resultats().innerHTML += '<p class="titre_result"><a class="titre_news" href="'+ object[i].url + '" target="_blank">'+ object[i].titre + '</a><span class="date_news">'+ formatDate(object[i].date) + '</span><span class="action_news" onclick="controler.supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>';
    } else {
      view.get_div_resultats().innerHTML += '<p class="titre_result"><a class="titre_news" href="'+ object[i].url + '" target="_blank">'+ object[i].titre + '</a><span class="date_news">'+ formatDate(object[i].date) + '</span><span class="action_news" onclick="controler.sauver_nouvelle(this)"><img src="img/horloge15.jpg"/></span></p>';
    }
  }
}
view.set_supprimer = function(elt) {
  elt.setAttribute("onclick", "controler.supprimer_nouvelle(this)");
  elt.firstChild.setAttribute("src","img/disk15.jpg");
}
view.set_sauver = function(elt) {
  elt.setAttribute("onclick", "controler.sauver_nouvelle(this)");
  elt.firstChild.setAttribute("src","img/horloge15.jpg");
}
view.obj_offre = function(parent) {
  var offre = new Object();
  offre.titre = parent.querySelector(".titre_news").textContent;
  offre.date = parent.querySelector(".date_news").textContent;
  offre.url = parent.querySelector(".titre_news").getAttribute("href");
  return offre;
}
view.ajouter_offre = function(offre) {
  view.get_div_resultats().innerHTML += '<p class="titre_result"><a class="titre_news" href="'+ offre.url + '" target="_blank">'+ offre.titre + '</a><span class="date_news">'+ offre.date + '</span><span class="action_news" onclick="controler.supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>';
}
view.eval = function(object) {
  for (var i = 0; i < model.get_recherche_courante_news().length; i++) {
    if (model.get_recherche_courante_news()[i].titre==decodeHtmlEntities(object.titre)) {
      return true;
    }
  }
  return false;
}

view.update_nb_recherches = function() {
    if (model.get_nb() != 0) {
      view.get_titre()[2].textContent = "résultats("+view.get_action_news().length+")";
    } else {
      view.get_titre()[2].textContent = "resultats";
    }
}
view.update_nb_sauv = function() {
    if (model.get_nb() != 0) {
      view.get_titre()[0].textContent = "recherches stockées("+model.get_nb()+")";
    } else {
      view.get_titre()[0].textContent = "recherches stockées";
    }
}
