# Prototype des Droits et Taxes

## Lancement

Ouvrir le fichier `index.html` avec son navigateur est suffisant.

Optionnellement un serveur local peut-être utilisé :
`python -m SimpleHTTPServer`.


## Tracking / analytics

Le projet utilise Google Analytics pour tracer le comportement utilisateurs.

2 codes distincts sont insérés :

- le mode [production](http://droits-et-taxes.fr) : _UA-45069184-4_
- le mode [demo](http://demo.droits-et-taxes.fr) : _UA-79921412-1_

> Lorsque le serveur tourne sur un serveur _localhost_, aucun tracking n'est
activé.


## Déploiement

Le projet est hébergé sur [Github Pages](https://pages.github.com).

La version de demo est hébergée sur https://github.com/scopyleft/douane-demo.
Le domaine est http://demo.droits-et-taxes.fr.

Pour accéder au déploiement en demo, on ajoutera le _remote_ "demo" :
`git remote add demo git@github.com:scopyleft/douane-demo.git`

- Pour déployer en production : `git push origin master`
- Pour déployer en demo : `git push demo dev:gh-pages`
