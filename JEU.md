# Etape de jeu

## V0 - Pioche de carte

### Description

Dans un premier temps, il faut faire quelque de simple, voir très simple.
On peut commencer par définir le nombre de joueurs de la partie. Sur une première page , on regroupe toute les options de la partie (nb joueurs, extensions, distribution des plateaux, hasard ou choix, et autres...)
Ensuite le jeu consiste à sélectionner une carte parmi un paquet, en affichant sur la page le nom (ou numéro) du joueur. Un fois qu'on peut sélectionner un carte, il faut mettre en place les différents paquets et la transmission de paquets.

### Étapes

- [ ] Page d'accueil
  - [x] Nombre de joueurs
  - [x] Extension à sélectionner
  - [ ] Sélection plateaux hasard / choix
    - [ ] Pour le choix = sélection du plateau par joueur
  - [x] Bouton lancer la partie
- [ ] Principe de jeu
  - [ ] Définir les propriétés d'une carte (dans une class)
    - [x] Age
    - [x] Nom
    - [ ] Type (ressources primaire, ressources secondaires, commerciales, culturelles, scientifiques, guildes) + couleur
    - [x] Prix (Ressource(s) ou carte spécifique)
    - [ ] Apport(s)
  - [x] Sans-doute définir une sous-class pour chaque type de carte => apports spécifique
  - [x] Liste de toutes les cartes
  - [ ] Paquet de cartes (class pour un paquet ?)
    - [ ] Retirer une carte lorsque sélectionnée
    - [ ] Paquet vide lorsque n == 1
  - [ ] Sous-class pour diff paquet distribution et cartes sélectionnés
    - [ ] Pour carte sélectionnée, on peut pas voir 2 fois la même carte
- [ ] Page de jeu
  - [x] Afficher les cartes du paquet
  - [x] Afficher le nom de la carte sélectionnée
  - [ ] Afficher le nom/numéro du joueur en cours
  - [ ] Afficher les cartes déjà sélectionnées ?

## Plus tard

Pièce

Comprendre `game.ts`, à quoi ça sert, comment ça fonctionne ?

## V1 - Plus mais je sais pas encore quoi
