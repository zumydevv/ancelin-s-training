# Ancelin Training

Programme salle + nutrition d'Ancelin, sous forme d'appli web installable sur téléphone (PWA).

- Objectif 1 : **prise de masse 74 → 85 kg**
- Objectif 2 : **sèche 85 → 75 kg**
- Taille : 1 m 78

## L'appli

| Onglet | Ce qu'il fait |
| --- | --- |
| **Aujourd'hui** | Séance du jour, calories et protéines du jour, poids du matin |
| **Programme** | La semaine, le détail de chaque séance, conseils d'exécution, règles de progression |
| **Nutrition** | Objectifs du jour, repas types à cocher, ajout libre (resto, extra…) |
| **Suivi** | Courbe de poids, rythme par semaine, records (1RM estimé), historique, réglages masse/sèche, sauvegarde |

Pendant une séance : tu notes kg et reps, tu tapes ✓, et le minuteur de repos démarre tout seul. L'appli affiche ce que tu as fait la dernière fois et te dit quand monter la charge. L'écran reste allumé et l'appli marche sans internet.

Les données restent dans le téléphone (localStorage). Pense à faire une sauvegarde de temps en temps (Suivi → Sauvegarder).

### Installer sur le téléphone

1. Mettre le site en ligne avec GitHub Pages : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, choisir la branche (`main`) et le dossier `/ (root)`, puis **Save**. Le lien ressemble à `https://zumydevv.github.io/ancelin-s-training/`.
2. Ouvrir le lien sur le téléphone :
   - **iPhone** : dans Safari, bouton Partager puis « Sur l'écran d'accueil »
   - **Android** : dans Chrome, menu ⋮ puis « Installer l'application »

### Modifier le programme ou les repas

Tout le contenu se trouve dans [`data.js`](data.js) : exercices, séries, reps, temps de repos, repas et objectifs. Après une modification, change `VERSION` dans [`sw.js`](sw.js) (par exemple `v2`) pour que les téléphones récupèrent la mise à jour.

Pour tester en local :

```bash
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.

---

## Le programme salle (5 séances par semaine)

| Jour | Séance |
| --- | --- |
| Lundi | **Push** : pecs, épaules, triceps |
| Mardi | **Pull** : dos, biceps, arrière d'épaule |
| Mercredi | **Jambes A** : quadriceps, mollets, abdos |
| Jeudi | Repos |
| Vendredi | **Haut du corps + Bras** |
| Samedi | **Jambes B** : ischios, fessiers, mollets, abdos |
| Dimanche | Repos |

### Push
| Exercice | Séries × reps | Repos |
| --- | --- | --- |
| Développé couché (barre) | 4 × 6-8 | 2 min 30 |
| Développé incliné haltères | 3 × 8-10 | 2 min |
| Développé épaules à la machine | 3 × 8-10 | 2 min |
| Pec fly (poulie ou machine) | 3 × 12-15 | 75 s |
| Élévations latérales poulie (unilatéral) | 4 × 12-15 | 60 s |
| Extension triceps poulie (pushdown) | 3 × 10-12 | 75 s |
| Extension triceps poulie au-dessus de la tête | 3 × 10-12 | 75 s |

### Pull
| Exercice | Séries × reps | Repos |
| --- | --- | --- |
| Tirage vertical (prise large) | 4 × 8-10 | 2 min |
| Rowing haltère unilatéral 🆕 | 3 × 8-10 | 90 s |
| Tirage horizontal (poulie basse) | 3 × 10-12 | 90 s |
| Oiseau à la poulie (unilatéral) | 3 × 15-20 | 60 s |
| Curl sur banc incliné | 3 × 8-10 | 75 s |
| Curl marteau | 3 × 10-12 | 75 s |

### Jambes A
| Exercice | Séries × reps | Repos |
| --- | --- | --- |
| Squat | 4 × 6-8 | 3 min |
| Presse à cuisses 🆕 | 3 × 10-12 | 2 min |
| Leg extension | 3 × 12-15 | 75 s |
| Leg curl | 3 × 10-12 | 75 s |
| Mollets 🆕 | 4 × 10-15 | 60 s |
| Crunch à la poulie 🆕 | 3 × 12-15 | 60 s |

### Haut du corps + Bras
| Exercice | Séries × reps | Repos |
| --- | --- | --- |
| Développé incliné barre (ou Smith) | 3 × 6-8 | 2 min 30 |
| Tirage vertical prise serrée / neutre | 3 × 10-12 | 90 s |
| Rowing poulie unilatéral 🆕 | 3 × 10-12 | 75 s |
| Élévations latérales poulie (unilatéral) | 3 × 12-15 | 60 s |
| Oiseau à la poulie (unilatéral) | 2 × 15-20 | 60 s |
| Curl à la poulie | 3 × 10-12 | 60 s |
| Curl unilatéral à la poulie | 2 × 12-15 | 60 s |
| Extension triceps unilatéral à la poulie | 3 × 10-12 | 60 s |

### Jambes B
| Exercice | Séries × reps | Repos |
| --- | --- | --- |
| Soulevé de terre roumain 🆕 | 4 × 6-8 | 2 min 30 |
| Fentes bulgares 🆕 | 3 × 8-10 | 90 s |
| Leg curl | 3 × 10-12 | 75 s |
| Leg extension | 2 × 15-20 | 60 s |
| Mollets 🆕 | 4 × 10-15 | 60 s |
| Relevés de jambes 🆕 | 3 × 10-15 | 60 s |

### Les règles
- **Reprise (2 premières semaines)** : une série de moins par exercice, et arrêter chaque série à environ 3 reps de l'échec.
- **Intensité** : ensuite, chaque série se fait à 1-2 reps de l'échec.
- **Progression** : quand tu fais le haut de la fourchette sur toutes les séries, ajoute du poids (+2,5 kg sur les gros exos, +1-2 kg sur l'isolation). Sinon, vise +1 rep.
- **Deload** toutes les 6 à 8 semaines : moitié moins de séries, charges -10 %.
- **4 jours seulement ?** Supprime Jambes B et ajoute le soulevé de terre roumain en début de Jambes A.

## Nutrition

| Phase | Calories | Protéines | Glucides | Lipides | Rythme visé |
| --- | --- | --- | --- | --- | --- |
| Prise de masse | ~3000 kcal | 175 g | 370 g | 80 g | +0,3 à +0,5 kg / semaine |
| Sèche | ~2300 kcal | 180 g | 260 g | 55 g | -0,5 à -0,75 kg / semaine |

Les repas types de chaque phase sont dans l'appli (onglet Nutrition). On ajuste avec la moyenne de poids de la semaine : si elle stagne 2 semaines en masse, +200 kcal ; si elle monte de plus de 0,7 kg par semaine, -200 kcal.

Complément conseillé : créatine monohydrate, 5 g par jour.
