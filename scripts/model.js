var model = {};
	model.recherche_courante;
	model.recherches = [];
	model.recherche_courante_news = [];
  model.nb = 0;
  model.ajouter_recherche = function(val) {
    model.recherches.push(val);
  }
  model.ajouter_recherche_courante_news = function(val) {
    model.recherche_courante_news.push(val);
  }
	model.supprimer_recherche_courante_news = function(index) {
		model.get_recherche_courante_news().splice(index,1);
	}
  model.get_recherches = function() {
    return model.recherches;
  }
  model.get_nb = function() {
    return model.nb;
  }
  model.incr_nb = function() {
    model.nb++;
  }
  model.decr_nb = function() {
    model.nb--;
  }
  model.maj_recherches = function() {
    var etat = model.toJSON();
    localStorage.setItem("recherches",etat);
    // console.log(localStorage.getItem("recherches"));
  }
  model.toJSON = function() {
    var json = {};
    var recherches = [];

    for (var i = 0; i < view.get_titrerecherche().length; i++) {
  		var j = i + 1;
  		var recherche = new Object();
      recherche.id = "recherche" + j;
      recherche.val = view.get_titrerecherche()[i].textContent;
      recherches.push(recherche);
  		j++;
    }
    json = {"recherches": recherches, "nombre": model.get_nb()};
    json = JSON.stringify(json);
    return json;
  }
  model.supprimer_recherches = function(elt) {
    var ind = model.get_recherches().indexOf(elt);
    model.get_recherches().splice(ind, 1);
  }
  model.get_local_recherches = function() {
    return localStorage.getItem("recherches");
  }
  model.get_local_item = function(cle) {
    return localStorage.getItem(cle);
  }
	model.set_local_item = function(cle, valeur) {
		localStorage.setItem(cle,valeur);
	}
	model.remove_local_item = function(cle) {
		localStorage.removeItem(cle);
	}
  model.set_recherche_courante = function(val) {
    model.recherche_courante = val;
  }
  model.get_recherche_courante_news = function() {
    return model.recherche_courante_news;
  }
