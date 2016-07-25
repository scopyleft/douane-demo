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

La version de demo et de dev sont hébergées sur https://github.com/scopyleft/douane-demo (http://demo.droits-et-taxes.fr) et https://github.com/scopyleft/douane-dev (http://dev.droits-et-taxes.fr).

Pour accéder au déploiement en demo et dev, on ajoutera les _remote_ "demo-repo" et "dev-repo" :
`git remote add demo-repo git@github.com:scopyleft/douane-demo.git`
`git remote add dev-repo git@github.com:scopyleft/douane-dev.git`

- Pour déployer en production : `git push origin gh-pages`
- Pour déployer en dev : `git push dev-repo dev:gh-pages`
- Pour déployer en demo : `git push demo-repo demo:gh-pages`
