var controler = {};
controler.init = function() {
  // Fonction appellée lors du chargement de la page
  var mesRecherches = model.get_local_recherches();
  var object = JSON.parse(mesRecherches);
  var nbTemp = 0;
  try {
    nbTemp = object.nombre;
  } catch (err) {
    ; //do nothing
  } finally {
    model.nb += nbTemp;
  }
  for (var i = 0; i < model.get_nb(); i++) {
      view.ajouter_recherche_stockee(object.recherches[i].val);
      model.ajouter_recherche(object.recherches[i].val);
  }
  view.update_nb_sauv();
}
controler.ajouter_recherche = function() {
  var val = view.get_zone_saisie_value();
  // Si la recherche n'existe pas
  if (model.get_recherches().indexOf(val) == -1 && val != "") {
       // Ajout dans le tableau de recherches
       model.ajouter_recherche(val);
       model.incr_nb();

       // Ajout de la recherche dans la partie recherches stockées de la page
       view.ajouter_recherche_stockee(val);

       // Mise à jour du modèle
       model.maj_recherches();

       // Mise à jour du nombre de recherches/sauvegardes de la vue
       view.update_nb_recherches();
       view.update_nb_sauv();
  }
}
controler.supprimer_recherche = function(elt) {
  // Suppression de l'élement html correspondant à la recherche
  view.supprimer_element(elt);

  // Suppression de l'élement dans le tableau de recherches et dans le localStorage
  model.supprimer_recherches(elt);

  // Mise à jour des recherches dans le localStorage
  model.decr_nb();
  model.maj_recherches();

  // Mise à jour du nombre de sauvegardes de la vue
  view.update_nb_sauv();
}
controler.selectionner_recherche = function(elt) {
  // Mise à jour de la zone de saisie
  view.set_zone_saisie(elt.textContent);

  // Mise à jour de la valeur de la recherche courante
  model.set_recherche_courante(elt.textContent)

  // Récupération des offres liées à la recherche courante depuis le localStorage
  var offres = JSON.parse(model.get_local_item(view.get_zone_saisie_value()));

  // Effacement des résultats précédents
  view.reinitialisation_resultats();

  if (offres!=null) {
    for (var i = 0; i < offres.recherche_courante_news.length; i++) {
      // div_resultats.innerHTML += '<p class="titre_result"><a class="titre_news" href="'+ offres.recherche_courante_news[i].url + '" target="_blank">'+ offres.recherche_courante_news[i].titre + '</a><span class="date_news">'+ offres.recherche_courante_news[i].date + '</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span></p>';
      view.ajouter_offre(offres.recherche_courante_news[i]);
    }
  }
  view.update_nb_recherches();
}
controler.rechercher_nouvelles = function() {
  // Effacement des résultats précédents
  view.reinitialisation_resultats();

  // Affichage de l'animation de chargement
  view.chargement();

  // Encodage de la valeur de recherche et envoi de la requête Ajax
  var res = view.get_zone_saisie_value();
  res = encodeURIComponent(res);
  controler.ajax_get_request(controler.maj_resultats, "https://carl-vincent.fr/search-internships.php?data=" + res, true);

  var offres = JSON.parse(model.get_local_item(view.get_zone_saisie_value()));

  if (offres!=null) {
    for (var i = 0; i < offres.recherche_courante_news.length; i++) {
      model.ajouter_recherche_courante_news(offres.recherche_courante_news[i]);
    }
  }
}
controler.maj_resultats = function(res) {
  // On masque l'animation de chargement
  view.reprise();
  var object = JSON.parse(res);

  // Affichage des résultats sur la page
  view.afficher_resultats(object);

  view.update_nb_recherches();
}
controler.ajax_get_request = function(callback, url, async) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (callback && xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
      callback(xhr.responseText);
    }
  };
  xhr.open("GET", url, async);
  xhr.send();
}
controler.sauver_nouvelle = function(elt) {
  // Fonction de sauvegarde des annonces
  var parent = elt.parentNode;
  view.set_supprimer(elt);

  var offre = view.obj_offre(parent);
  if (indexOfResultat(model.get_recherche_courante_news(),offre)==-1) {
    model.ajouter_recherche_courante_news(offre);
    var recherche_courante_news = model.get_recherche_courante_news();
    var json = {recherche_courante_news};
    json = JSON.stringify(json);
    localStorage.setItem(view.get_zone_saisie_value(),json);
  }
}
controler.supprimer_nouvelle = function(elt) {
  // Fonction de suppression des annonces
  var parent = elt.parentNode;
  view.set_sauver(elt);

  var offre = view.obj_offre(parent);
  var index = indexOfResultat(model.get_recherche_courante_news(),offre);
  if(index!=-1) {
    model.supprimer_recherche_courante_news(index);
    var recherche_courante_news = model.get_recherche_courante_news();
    var json = {recherche_courante_news};
    json = JSON.stringify(json);
    if(recherche_courante_news!=0) {
      model.set_local_item(view.get_zone_saisie_value(),json);
    }
    else {
      model.remove_local_item(view.get_zone_saisie_value());
    }
  }
}
