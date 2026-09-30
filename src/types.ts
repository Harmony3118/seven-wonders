// enum categorie_enum {
//   Mat_premiere,
//   Prod_manufact,
//   Bat_civil,
//   Bat_commercial,
//   Bat_militaire,
//   Bat_scientifique,
//   Guilde,
// }

enum Age {
  I,
  II,
  III,
}

export enum Ressources {
  ARGILE,
  PIERRE,
  MINERAI,
  BOIS,
  VERRE,
  TISSU,
  PAPYRUS,
  PIECES,
}

export enum Recherche {
  GEOMETRIE,
  ROUE,
  TABLETTE,
}

export class Cout {
  parent: string = ''
  r: Record<Ressources, number> = {
    [Ressources.ARGILE]: 0,
    [Ressources.PIERRE]: 0,
    [Ressources.MINERAI]: 0,
    [Ressources.BOIS]: 0,
    [Ressources.VERRE]: 0,
    [Ressources.TISSU]: 0,
    [Ressources.PAPYRUS]: 0,
    [Ressources.PIECES]: 0,
  }

  // Surcharge du constructeur
  constructor(nom: string, ...paires: [Ressources, number][])
  constructor(...paires: [Ressources, number][])
  constructor(...args: (string | [Ressources, number])[]) {
    // if constructor 1 avec nom
    if (typeof args[0] === 'string') {
      this.parent = args.shift() as string
    }

    // check quantité de valeurs restantes
    // if (args.length % 2 !== 0) {
    //   throw Error('Arguments en paires (ressource, quantité)')
    // }

    // if constructor 2 sans nom
    for (const [res, qte] of args as [Ressources, number][]) {
      this.r[res] += qte
    }
  }
}

export abstract class Carte {
  age: number
  nom: string
  couleur: string
  cout: Cout
  //   heritage: Carte[]
  //   effet: any

  constructor(age: number, nom: string, couleur: string, cout: Cout, herit: any[]) {
    this.nom = nom
    this.cout = cout
    this.couleur = couleur

    if (age < 1 || age > 3) {
      throw Error('Le jeu se déroule en 3 age maximum')
    }
    this.age = age
    // this.heritage = herit // pas non plus obligatoire
  }

  score() {
    console.log('Pas de points')
    return 0
  }
}

export class CarteMatierePremiere extends Carte {
  gain1: Ressources
  quantite1: number
  gain2: Ressources | undefined
  quantite2: number

  constructor(
    age: number,
    nom: string,
    r1: Ressources,
    nb1: number,
    r2?: Ressources,
    nb2?: number,
  ) {
    if (
      r1 != Ressources.ARGILE &&
      r1 != Ressources.BOIS &&
      r1 != Ressources.MINERAI &&
      r1 != Ressources.PIERRE
    ) {
      throw Error("r1 n'est pas une matiere premiere")
    }
    if (
      r2 != undefined &&
      r2 != Ressources.ARGILE &&
      r2 != Ressources.BOIS &&
      r2 != Ressources.MINERAI &&
      r2 != Ressources.PIERRE
    ) {
      console.log(r2)
      throw Error("r2 n'est pas une matiere premiere")
    }

    super(age, nom, '#9F582A', new Cout(), [])
    this.gain1 = r1
    this.quantite1 = nb1

    this.gain2 = r2 ?? undefined
    this.quantite2 = nb2 ?? 0
  }
}

export class CarteProduitManufacture extends Carte {
  gain: Ressources
  constructor(age: number, nom: string, r: Ressources) {
    super(age, nom, '#A7A9AC', new Cout(), [])
    if (r != Ressources.PAPYRUS && r != Ressources.TISSU && r != Ressources.VERRE) {
      throw Error("Ce n'est pas un produit manufacture")
    }
    this.gain = r
  }
}

export class CarteCivil extends Carte {
  gain: number
  constructor(age: number, nom: string, pts: number, cout: Cout) {
    super(age, nom, '#0198D4', cout, [])
    this.gain = pts
  }

  score() {
    return this.gain
  }
}

export class CarteMilitaire extends Carte {
  bouclier: number
  constructor(age: number, nom: string, bouclier: number, cout: Cout) {
    super(age, nom, '#D9212C', cout, [])
    this.bouclier = bouclier
  }
}

export class CarteScientifique extends Carte {
  symbole: Recherche
  constructor(age: number, nom: string, symbole: Recherche, cout: Cout) {
    super(age, nom, '#52A652', cout, [])
    this.symbole = symbole
  }
}

export class CarteCommerciale extends Carte {
  // le gain est à redéfinir plus tard, l'action est différente pour chaque carte
  // prendre une fonction en argument ?
  gain: string
  constructor(age: number, nom: string, gain: string, cout: Cout) {
    super(age, nom, '#FCAF17', cout, [])
    this.gain = gain
  }
}

export class CarteGuilde extends Carte {
  // le gain est à redéfinir plus tard, l'action est différente pour chaque carte
  // prendre une fonction en argument ?
  gain: string
  constructor(nom: string, gain: string, cout: Cout) {
    super(3, 'Guilde des ' + nom, '#7168AF', cout, [])
    this.gain = gain
  }
}
