import cartesJson from './cartes.json'
import { Ressources, Cout, Recherche, Carte } from '../types'
import {
  CarteMatierePremiere,
  CarteProduitManufacture,
  CarteCivil,
  CarteMilitaire,
  CarteScientifique,
  CarteCommerciale,
  CarteGuilde,
} from '../types'

// Typage data JSON
type NomRessource =
  | 'argile'
  | 'pierre'
  | 'minerai'
  | 'bois'
  | 'verre'
  | 'tissu'
  | 'papyrus'
  | 'pieces'

type DefinitionCommune = {
  age: number
  joueur_min: number
  nom: string
  cout: [string | [NomRessource, number]]
}

type DefinitionCarte =
  | (DefinitionCommune & {
      type: 'matierePremiere'
      ressource: NomRessource
      quantite: number
      ressource2?: NomRessource
      quantite2?: number
    })
  | (DefinitionCommune & { type: 'produitManufacture'; ressource: NomRessource })
  | (DefinitionCommune & { type: 'civil'; points: number })
  | (DefinitionCommune & { type: 'militaire'; boucliers: number })
  | (DefinitionCommune & { type: 'scientifique'; symbole: 'geometrie' | 'roue' | 'tablette' })
  | (DefinitionCommune & { type: 'commerciale'; gain: string })
  | (DefinitionCommune & { type: 'guilde'; gain: string })

// JSON to Carte
const ressources: Record<NomRessource, Ressources> = {
  argile: Ressources.ARGILE,
  pierre: Ressources.PIERRE,
  minerai: Ressources.MINERAI,
  bois: Ressources.BOIS,
  verre: Ressources.VERRE,
  tissu: Ressources.TISSU,
  papyrus: Ressources.PAPYRUS,
  pieces: Ressources.PIECES,
}

const recherches: Record<'geometrie' | 'roue' | 'tablette', Recherche> = {
  geometrie: Recherche.GEOMETRIE,
  roue: Recherche.ROUE,
  tablette: Recherche.TABLETTE,
}

function creerCout(cout: (string | [NomRessource, number])[]): Cout {
  const parent = typeof cout[0] === 'string' ? cout[0] : undefined
  const elements = parent === undefined ? cout : cout.slice(1)

  const paires = elements.map(([nom, quantite]) => {
    const ressource = ressources[nom as NomRessource]
    if (ressource === undefined) {
      throw new Error(`Ressource inconnue dans le coût : ${nom}`)
    }

    return [ressource, quantite] as [Ressources, number]
  })

  return parent === undefined ? new Cout(...paires) : new Cout(parent, ...paires)
}

export function creerCartes(nb_joueurs: number): Carte[] {
  // Data JSON
  const catalogue_cartes = cartesJson as DefinitionCarte[]

  return catalogue_cartes.map((carte) => {
    switch (carte.type) {
      case 'matierePremiere':
        return new CarteMatierePremiere(
          carte.age,
          carte.nom,
          ressources[carte.ressource],
          carte.quantite,
          carte.ressource2 ? ressources[carte.ressource2] : undefined,
          carte.quantite2,
        )
      case 'produitManufacture':
        return new CarteProduitManufacture(
          carte.age,
          carte.nom,
          ressources[carte.ressource],
        )
      case 'civil':
        return new CarteCivil(
          carte.age,
          carte.nom,
          carte.points,
          creerCout(carte.cout),
        )
      case 'militaire':
        return new CarteMilitaire(
          carte.age,
          carte.nom,
          carte.boucliers,
          creerCout(carte.cout),
        )
      case 'scientifique':
        return new CarteScientifique(
          carte.age,
          carte.nom,
          recherches[carte.symbole],
          creerCout(carte.cout),
        )
      case 'commerciale':
        return new CarteCommerciale(
          carte.age,
          carte.nom,
          carte.gain,
          creerCout(carte.cout),
        )
      case 'guilde':
        return new CarteGuilde(carte.nom, carte.gain, creerCout(carte.cout))
    }
  })
}

// export const catalogue_cartes = [
//   new CarteMatierePremiere(1, 'Chantier', Ressources.BOIS, 1),
//   new CarteMatierePremiere(1, 'Cavité', Ressources.PIERRE, 1),
//   new CarteMatierePremiere(1, 'Bassin argileux', Ressources.ARGILE, 1),
//   new CarteMatierePremiere(1, 'Filon', Ressources.MINERAI, 1),

//   new CarteMatierePremiere(1, 'Friche', Ressources.BOIS, 1, Ressources.ARGILE, 1),
//   new CarteMatierePremiere(1, 'Excavation', Ressources.PIERRE, 1, Ressources.ARGILE, 1),
//   new CarteMatierePremiere(1, 'Fosse argileuse', Ressources.MINERAI, 1, Ressources.ARGILE, 1),
//   new CarteMatierePremiere(1, 'Exploitation forestière', Ressources.BOIS, 1, Ressources.PIERRE, 1),
//   new CarteMatierePremiere(1, 'Gisement', Ressources.BOIS, 1, Ressources.MINERAI, 1),
//   new CarteMatierePremiere(1, 'Mine', Ressources.PIERRE, 1, Ressources.MINERAI, 1),

//   new CarteMatierePremiere(2, 'Scierie', Ressources.BOIS, 2),
//   new CarteMatierePremiere(2, 'Carrière', Ressources.PIERRE, 2),
//   new CarteMatierePremiere(2, 'Briqueterie', Ressources.ARGILE, 2),
//   new CarteMatierePremiere(2, 'Fonderie', Ressources.MINERAI, 2),

//   new CarteProduitManufacture(1, 'Verrerie', Ressources.VERRE),
//   new CarteProduitManufacture(1, 'Presse', Ressources.PAPYRUS),
//   new CarteProduitManufacture(1, 'Métier à tisser', Ressources.TISSU),
//   new CarteProduitManufacture(2, 'Verrerie', Ressources.VERRE),
//   new CarteProduitManufacture(2, 'Presse', Ressources.PAPYRUS),
//   new CarteProduitManufacture(2, 'Métier à tisser', Ressources.TISSU),

//   new CarteCivil(1, 'Puits', 3, new Cout()),
//   new CarteCivil(1, 'Bains', 3, new Cout([Ressources.PIERRE, 1])),
//   new CarteCivil(1, 'Autel', 3, new Cout()),
//   new CarteCivil(1, 'Théatre', 3, new Cout()),

//   new CarteCivil(
//     2,
//     'Statue',
//     4,
//     new Cout('Théatre', [Ressources.MINERAI, 2], [Ressources.BOIS, 1]),
//   ),
//   new CarteCivil(
//     2,
//     'Temple',
//     4,
//     new Cout('Autel', [Ressources.BOIS, 1], [Ressources.ARGILE, 1], [Ressources.VERRE, 1]),
//   ),
//   new CarteCivil(2, 'Tribunal', 4, new Cout()),
//   new CarteCivil(2, 'Aqueduc', 5, new Cout('Bains', [Ressources.PIERRE, 3])),

//   new CarteCivil(3, 'Jardin', 5, new Cout('Statue', [Ressources.ARGILE, 2], [Ressources.BOIS, 1])),
//   new CarteCivil(
//     3,
//     'Hôtel de ville',
//     6,
//     new Cout([Ressources.PIERRE, 2], [Ressources.MINERAI, 1], [Ressources.VERRE, 1]),
//   ),
//   new CarteCivil(
//     3,
//     'Sénat',
//     6,
//     new Cout([Ressources.BOIS, 2], [Ressources.MINERAI, 1], [Ressources.PIERRE, 1]),
//   ),
//   new CarteCivil(
//     3,
//     'Panthéon',
//     7,
//     new Cout(
//       'Temple',
//       [Ressources.ARGILE, 2],
//       [Ressources.MINERAI, 1],
//       [Ressources.PAPYRUS, 1],
//       [Ressources.TISSU, 1],
//       [Ressources.VERRE, 1],
//     ),
//   ),
//   new CarteCivil(
//     3,
//     'Palace',
//     8,
//     new Cout(
//       [Ressources.ARGILE, 1],
//       [Ressources.BOIS, 1],
//       [Ressources.MINERAI, 1],
//       [Ressources.PIERRE, 1],
//       [Ressources.PAPYRUS, 1],
//       [Ressources.TISSU, 1],
//       [Ressources.VERRE, 1],
//     ),
//   ),

//   new CarteMilitaire(1, 'Palissade', 1, new Cout([Ressources.BOIS, 1])),
//   new CarteMilitaire(1, 'Caserne', 1, new Cout([Ressources.MINERAI, 1])),
//   new CarteMilitaire(1, 'Tour de garde', 1, new Cout([Ressources.ARGILE, 1])),

//   new CarteMilitaire(
//     2,
//     'Écuries',
//     2,
//     new Cout('Officine', [Ressources.MINERAI, 2], [Ressources.ARGILE, 1], [Ressources.BOIS, 1]),
//   ),
//   new CarteMilitaire(
//     2,
//     'Champs de tir',
//     2,
//     new Cout('Atelier', [Ressources.MINERAI, 1], [Ressources.BOIS, 2]),
//   ),
//   new CarteMilitaire(2, 'Muraille', 2, new Cout([Ressources.PIERRE, 3])),
//   new CarteMilitaire(
//     2,
//     "Place d'armes",
//     2,
//     new Cout([Ressources.MINERAI, 2], [Ressources.BOIS, 1]),
//   ),

//   new CarteMilitaire(
//     3,
//     'Fortifications',
//     3,
//     new Cout('Muraille', [Ressources.MINERAI, 3], [Ressources.PIERRE, 1]),
//   ),
//   new CarteMilitaire(
//     3,
//     'Cirque',
//     3,
//     new Cout("Place d'armes", [Ressources.PIERRE, 3], [Ressources.MINERAI, 1]),
//   ),
//   new CarteMilitaire(
//     3,
//     'Arsenal',
//     3,
//     new Cout([Ressources.MINERAI, 1], [Ressources.BOIS, 2], [Ressources.TISSU, 1]),
//   ),
//   new CarteMilitaire(
//     3,
//     'Atelier de siège',
//     3,
//     new Cout('Laboratoire', [Ressources.BOIS, 1], [Ressources.ARGILE, 3]),
//   ),

//   new CarteScientifique(1, 'Officine', Recherche.GEOMETRIE, new Cout([Ressources.TISSU, 1])),
//   new CarteScientifique(1, 'Atelier', Recherche.ROUE, new Cout([Ressources.VERRE, 1])),
//   new CarteScientifique(1, 'Scriptorium', Recherche.TABLETTE, new Cout([Ressources.PAPYRUS, 1])),

//   new CarteScientifique(
//     2,
//     'Dispensaire',
//     Recherche.GEOMETRIE,
//     new Cout('Officine', [Ressources.MINERAI, 2], [Ressources.VERRE, 1]),
//   ),
//   new CarteScientifique(
//     2,
//     'Laboratoire',
//     Recherche.ROUE,
//     new Cout('Atelier', [Ressources.ARGILE, 2], [Ressources.PAPYRUS, 1]),
//   ),
//   new CarteScientifique(
//     2,
//     'Bibliothèque',
//     Recherche.TABLETTE,
//     new Cout('Scriptorium', [Ressources.PIERRE, 2], [Ressources.TISSU, 1]),
//   ),
//   new CarteScientifique(
//     2,
//     'École',
//     Recherche.TABLETTE,
//     new Cout([Ressources.BOIS, 1], [Ressources.PAPYRUS, 1]),
//   ),

//   new CarteScientifique(
//     3,
//     'Loge',
//     Recherche.GEOMETRIE,
//     new Cout('Dispensaire', [Ressources.ARGILE, 2], [Ressources.TISSU, 1], [Ressources.PAPYRUS, 1]),
//   ),
//   new CarteScientifique(
//     3,
//     'Académie',
//     Recherche.GEOMETRIE,
//     new Cout('École', [Ressources.PIERRE, 3], [Ressources.VERRE, 1]),
//   ),
//   new CarteScientifique(
//     3,
//     'Observatoire',
//     Recherche.ROUE,
//     new Cout('Laboratoire', [Ressources.MINERAI, 2], [Ressources.TISSU, 1], [Ressources.VERRE, 1]),
//   ),
//   new CarteScientifique(
//     3,
//     'Étude',
//     Recherche.ROUE,
//     new Cout('École', [Ressources.BOIS, 1], [Ressources.PAPYRUS, 1], [Ressources.TISSU, 1]),
//   ),
//   new CarteScientifique(
//     3,
//     'Université',
//     Recherche.TABLETTE,
//     new Cout('Bibliothèque', [Ressources.BOIS, 2], [Ressources.VERRE, 1], [Ressources.PAPYRUS, 1]),
//   ),

//   new CarteCommerciale(1, 'Taverne', '5 pièces', new Cout()),
//   new CarteCommerciale(1, 'Marché', 'Achat à 1 pièce des produits manufacturés', new Cout()),
//   new CarteCommerciale(1, 'Comptoir ouest', 'Achat à 1 pièce des matières premières', new Cout()),
//   new CarteCommerciale(1, 'Comptoir est', 'Achat à 1 pièce des matières premières', new Cout()),

//   new CarteCommerciale(
//     2,
//     'Caravansérail',
//     "Commerce d'une matière première au choix",
//     new Cout('Marché', [Ressources.ARGILE, 2]),
//   ),
//   new CarteCommerciale(
//     2,
//     'Forum',
//     "Commerce d'un produit manufacturé au choix",
//     new Cout('Comptoir est', [Ressources.BOIS, 2]),
//   ),
//   new CarteCommerciale(
//     2,
//     'Vignoble',
//     "Gain d'une pièce pour chaque carte marron de moi et mes voisins",
//     new Cout(),
//   ),
//   new CarteCommerciale(
//     2,
//     'Bazar',
//     "Gain d'une pièce pour chaque carte grise de moi et mes voisins",
//     new Cout(),
//   ),

//   new CarteCommerciale(
//     3,
//     'Phare',
//     "Gain d'une pièce et d'un point pour chacune de mes cartes jaune",
//     new Cout('Caravansérail', [Ressources.PIERRE, 1], [Ressources.VERRE, 1]),
//   ),
//   new CarteCommerciale(
//     3,
//     'Port',
//     "Gain d'une pièce et d'un point pour chacune de mes cartes marron",
//     new Cout('Forum', [Ressources.BOIS, 1], [Ressources.MINERAI, 1], [Ressources.TISSU, 1]),
//   ),
//   new CarteCommerciale(
//     3,
//     'Chambre de commerce',
//     'Gain de 2 pièces et 2 points pour chacune de mes cartes grises',
//     new Cout([Ressources.ARGILE, 2], [Ressources.PAPYRUS, 1]),
//   ),
//   new CarteCommerciale(
//     3,
//     'Arène',
//     "Gain de 3 pièces et d'un point pour chaque étage de ma merveille",
//     new Cout('Dispensaire', [Ressources.PIERRE, 2], [Ressources.MINERAI, 1]),
//   ),

//   new CarteGuilde(
//     'Travailleurs',
//     "Gain d'un point pour chaque carte marron de mes voisins",
//     new Cout(
//       [Ressources.PIERRE, 1],
//       [Ressources.MINERAI, 2],
//       [Ressources.ARGILE, 1],
//       [Ressources.BOIS, 1],
//     ),
//   ),
//   new CarteGuilde(
//     'Artisans',
//     'Gain de 2 points pour chaque carte grise de mes voisins',
//     new Cout([Ressources.PIERRE, 2], [Ressources.MINERAI, 2]),
//   ),
//   new CarteGuilde(
//     'Magistrats',
//     "Gain d'un point pour chaque carte bleu de mes voisins",
//     new Cout([Ressources.BOIS, 3], [Ressources.TISSU, 1], [Ressources.PIERRE, 1]),
//   ),
//   new CarteGuilde(
//     'Commerçants',
//     "Gain d'un point pour chaque carte jaune de mes voisins",
//     new Cout([Ressources.VERRE, 1], [Ressources.TISSU, 1], [Ressources.PAPYRUS, 1]),
//   ),
//   new CarteGuilde(
//     'Batisseurs',
//     "Gain d'un point pour chaque étage de merveille construit de moi et mes voisins",
//     new Cout([Ressources.PIERRE, 2], [Ressources.ARGILE, 2], [Ressources.VERRE, 1]),
//   ),
//   new CarteGuilde(
//     'Espions',
//     "Gain d'un point pour chaque carte rouge de mes voisins",
//     new Cout([Ressources.ARGILE, 3], [Ressources.VERRE, 1]),
//   ),
//   new CarteGuilde(
//     'Philosophes',
//     "Gain d'un point pour chaque carte vertes de mes voisins",
//     new Cout([Ressources.ARGILE, 3], [Ressources.TISSU, 1], [Ressources.PAPYRUS, 1]),
//   ),
//   new CarteGuilde(
//     'Scientifiques',
//     "Gain d'un symbole de recherche au choix",
//     new Cout([Ressources.BOIS, 2], [Ressources.MINERAI, 2], [Ressources.PAPYRUS, 1]),
//   ),
//   new CarteGuilde(
//     'Armateurs',
//     "Gain d'un point pour chacune de mes cartes marron, grises et violettes",
//     new Cout([Ressources.BOIS, 3], [Ressources.PAPYRUS, 1], [Ressources.VERRE, 1]),
//   ),
//   new CarteGuilde(
//     'Stratèges',
//     "Gain d'un point pour chaque défaites militaires de mes voisins",
//     new Cout([Ressources.PIERRE, 1], [Ressources.MINERAI, 2], [Ressources.TISSU, 1]),
//   ),
// ]
