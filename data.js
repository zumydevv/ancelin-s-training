// =====================================================================
//  Données du plan : programme salle + nutrition.
//  Tout ce qui est "contenu" est ici : pour changer un exo, des séries,
//  des reps ou un repas, il suffit de modifier ce fichier.
// =====================================================================

window.PLAN = {
  athlete: {
    name: 'Ancelin',
    heightCm: 178,
    startWeight: 74,
    bulkTarget: 85, // objectif prise de masse
    cutTarget: 75,  // objectif sèche
  },

  // Jour de la semaine (0 = dimanche, 1 = lundi, ...) -> séance
  schedule: { 1: 'push', 2: 'pull', 3: 'jambesA', 4: null, 5: 'haut', 6: 'jambesB', 0: null },

  sessions: {
    push: {
      name: 'Push',
      focus: 'Pecs · Épaules · Triceps',
      exercises: [
        { id: 'dev-couche', name: 'Développé couché (barre)', sets: 4, reps: '6-8', rest: 150,
          tip: "Omoplates serrées et basses, pieds bien ancrés. Descends contrôlé jusqu'au bas des pecs, pousse fort. Fais 2-3 séries de montée en charge avant." },
        { id: 'incline-halteres', name: 'Développé incliné haltères', sets: 3, reps: '8-10', rest: 120,
          tip: "Banc à 30°, pas plus (sinon ce sont les épaules qui travaillent). Descends bas pour bien étirer les pecs." },
        { id: 'shoulder-press', name: 'Développé épaules à la machine', sets: 3, reps: '8-10', rest: 120,
          tip: "Dos collé au dossier, poignées à hauteur du menton au départ. Ne verrouille pas les coudes en haut." },
        { id: 'pec-fly', name: 'Pec fly (poulie ou machine)', sets: 3, reps: '12-15', rest: 75,
          tip: "Bras légèrement fléchis et fixes, pense à rapprocher les coudes. Contrôle l'étirement, serre 1 s au milieu." },
        { id: 'elev-lat', name: 'Élévations latérales poulie (unilatéral)', sets: 4, reps: '12-15', rest: 60,
          tip: "Poulie en bas. Monte jusqu'à hauteur d'épaule en menant avec le coude, sans élan. Charge légère, exécution parfaite." },
        { id: 'triceps-pushdown', name: 'Extension triceps à la poulie (pushdown)', sets: 3, reps: '10-12', rest: 75,
          tip: "Coudes collés au corps et immobiles. Tends complètement en bas et contracte 1 s." },
        { id: 'triceps-overhead', name: 'Extension triceps poulie au-dessus de la tête', sets: 3, reps: '10-12', rest: 75,
          tip: "Dos à la poulie, coudes vers le haut. Gros étirement en bas : c'est le meilleur exo pour la longue portion du triceps (celle qui fait le volume du bras)." },
      ],
    },

    pull: {
      name: 'Pull',
      focus: 'Dos · Biceps · Arrière d’épaule',
      exercises: [
        { id: 'tirage-vertical', name: 'Tirage vertical (prise large)', sets: 4, reps: '8-10', rest: 120,
          tip: "Poitrine sortie, tire les coudes vers les hanches. Barre jusqu'au haut des pecs, pas de balancement." },
        { id: 'rowing-haltere', name: 'Rowing haltère unilatéral', sets: 3, reps: '8-10', rest: 90, isNew: true,
          tip: "Un genou et une main sur le banc, dos plat. Tire l'haltère vers la hanche (pas vers l'épaule)." },
        { id: 'tirage-horizontal', name: 'Tirage horizontal (poulie basse)', sets: 3, reps: '10-12', rest: 90,
          tip: "Dos droit, ne bascule pas en arrière. Serre les omoplates en fin de mouvement, laisse bien étirer devant." },
        { id: 'oiseau', name: 'Oiseau à la poulie (unilatéral) – arrière d’épaule', sets: 3, reps: '15-20', rest: 60,
          tip: "Bras presque tendu, tire vers l'arrière en ouvrant large. Garde les épaules basses pour ne pas faire travailler les trapèzes." },
        { id: 'curl-incline', name: 'Curl sur banc incliné (haltères)', sets: 3, reps: '8-10', rest: 75,
          tip: "Banc à 45-60°, bras qui pendent derrière le buste. Gros étirement du biceps, ne ramène pas les coudes vers l'avant." },
        { id: 'curl-marteau', name: 'Curl marteau', sets: 3, reps: '10-12', rest: 75,
          tip: "Prise neutre (pouces vers le haut), coudes fixes, pas d'élan." },
      ],
    },

    jambesA: {
      name: 'Jambes A',
      focus: 'Quadriceps · Mollets · Abdos',
      exercises: [
        { id: 'squat', name: 'Squat (barre)', sets: 4, reps: '6-8', rest: 180,
          tip: "Gainage fort, pieds largeur d'épaules. Descends au moins à la parallèle, genoux dans l'axe des pieds. 3-4 séries de montée en charge avant." },
        { id: 'presse', name: 'Presse à cuisses', sets: 3, reps: '10-12', rest: 120, isNew: true,
          tip: "Descends profond sans décoller le bas du dos du dossier. Ne verrouille pas les genoux en haut." },
        { id: 'leg-ext', name: 'Leg extension', sets: 3, reps: '12-15', rest: 75,
          tip: "Contracte 1 s en haut, descente contrôlée en 2 s." },
        { id: 'leg-curl', name: 'Leg curl', sets: 3, reps: '10-12', rest: 75,
          tip: "Hanches plaquées contre le banc / siège, descente lente." },
        { id: 'mollets', name: 'Mollets (debout ou à la presse)', sets: 4, reps: '10-15', rest: 60, isNew: true,
          tip: "Amplitude complète : pause 1-2 s en bas en étirement, monte le plus haut possible." },
        { id: 'crunch-poulie', name: 'Crunch à la poulie', sets: 3, reps: '12-15', rest: 60, isNew: true,
          tip: "À genoux, enroule le buste (côtes vers le bassin). Ne tire pas avec les bras." },
      ],
    },

    haut: {
      name: 'Haut du corps + Bras',
      focus: 'Haut des pecs · Dos · Épaules · Bras',
      exercises: [
        { id: 'incline-barre', name: 'Développé incliné barre (ou Smith)', sets: 3, reps: '6-8', rest: 150,
          tip: "Banc à 30°. C'est la version lourde de la semaine pour le haut des pecs." },
        { id: 'tirage-vertical-serre', name: 'Tirage vertical prise serrée / neutre', sets: 3, reps: '10-12', rest: 90,
          tip: "Poignée triangle ou prise serrée. Tire vers le haut des abdos, laisse bien étirer en haut." },
        { id: 'rowing-poulie-uni', name: 'Rowing poulie unilatéral', sets: 3, reps: '10-12', rest: 75, isNew: true,
          tip: "Une main, tire le coude loin derrière. Laisse l'omoplate avancer à l'étirement." },
        { id: 'elev-lat', name: 'Élévations latérales poulie (unilatéral)', sets: 3, reps: '12-15', rest: 60,
          tip: "Poulie en bas. Monte jusqu'à hauteur d'épaule en menant avec le coude, sans élan." },
        { id: 'oiseau', name: 'Oiseau à la poulie (unilatéral) – arrière d’épaule', sets: 2, reps: '15-20', rest: 60,
          tip: "Bras presque tendu, tire vers l'arrière en ouvrant large, épaules basses." },
        { id: 'curl-poulie', name: 'Curl à la poulie', sets: 3, reps: '10-12', rest: 60,
          tip: "Coudes fixes le long du corps, tension constante. Descente contrôlée en 2 s." },
        { id: 'curl-poulie-uni', name: 'Curl unilatéral à la poulie', sets: 2, reps: '12-15', rest: 60,
          tip: "Une main à la fois. Place-toi dos à la poulie, bras légèrement en arrière, pour étirer le biceps." },
        { id: 'triceps-uni', name: 'Extension triceps unilatéral à la poulie', sets: 3, reps: '10-12', rest: 60,
          tip: "Un bras à la fois, coude fixe. Contracte 1 s en bas." },
      ],
    },

    jambesB: {
      name: 'Jambes B',
      focus: 'Ischios · Fessiers · Mollets · Abdos',
      exercises: [
        { id: 'sdt-roumain', name: 'Soulevé de terre roumain', sets: 4, reps: '6-8', rest: 150, isNew: true,
          tip: "Jambes quasi tendues, pousse les fesses en arrière, barre collée aux jambes. Descends jusqu'à l'étirement des ischios, dos neutre." },
        { id: 'fentes-bulgares', name: 'Fentes bulgares (haltères)', sets: 3, reps: '8-10', rest: 90, isNew: true,
          tip: "Pied arrière sur le banc. Buste légèrement penché = plus de fessiers. Commence par la jambe la plus faible." },
        { id: 'leg-curl', name: 'Leg curl', sets: 3, reps: '10-12', rest: 75,
          tip: "Hanches plaquées, descente lente." },
        { id: 'leg-ext', name: 'Leg extension', sets: 2, reps: '15-20', rest: 60,
          tip: "Séries plus légères et longues, contraction 1 s en haut." },
        { id: 'mollets', name: 'Mollets (debout ou à la presse)', sets: 4, reps: '10-15', rest: 60, isNew: true,
          tip: "Pause en bas en étirement, monte le plus haut possible." },
        { id: 'releves-jambes', name: 'Relevés de jambes (suspendu ou chaise romaine)', sets: 3, reps: '10-15', rest: 60, isNew: true,
          tip: "Enroule le bassin vers le haut, pas de balancier." },
      ],
    },
  },

  // Ce qui a changé par rapport à l'ancien programme
  changes: [
    "Chaque muscle est travaillé 2 fois par semaine au lieu d'une : c'est plus efficace pour prendre du muscle.",
    "Le dos passe de 2 à 6 exercices sur la semaine (rowing haltère, rowing poulie, tirage serré). C'est lui qui donne la carrure.",
    "Les jambes ont maintenant 2 séances, avec soulevé de terre roumain, presse, fentes bulgares et mollets. C'est la moitié de ta masse musculaire : impossible de remonter à 85 kg sans elles.",
    "Tous tes exos de bras et d'épaules sont gardés, mais répartis sur 2 séances pour arriver frais sur chacun.",
    "Ajout d'abdos 2 fois par semaine.",
  ],

  principles: [
    { title: 'Reprise (2 premières semaines)', text: "Fais une série de moins par exercice et arrête chaque série à environ 3 reps de l'échec. Les muscles reviennent vite grâce à la mémoire musculaire, mais les tendons non : c'est là qu'on se blesse en reprenant." },
    { title: 'Intensité', text: "Ensuite, chaque série de travail se fait à 1-2 reps de l'échec (tu pourrais en faire 1 ou 2 de plus, pas davantage). Sur les exos d'isolation, la dernière série peut aller jusqu'à l'échec." },
    { title: 'Progression (double progression)', text: "Quand tu atteins le haut de la fourchette sur toutes les séries (ex : 4 × 8 au couché), tu ajoutes du poids la séance suivante : +2,5 kg sur les gros exos, +1 à 2 kg (ou un cran) sur l'isolation. Sinon, vise juste +1 rep. L'appli t'affiche ce que tu as fait la dernière fois." },
    { title: 'Échauffement', text: "5 min de cardio léger, puis 2-3 séries de montée en charge sur le premier exercice de la séance (ex : barre à vide × 10, 50 % × 6, 75 % × 3)." },
    { title: 'Repos', text: "2 à 3 min sur les gros exercices, 60 à 90 s sur l'isolation. Le minuteur se lance tout seul quand tu valides une série." },
    { title: 'Deload', text: "Toutes les 6 à 8 semaines, fais une semaine allégée : moitié moins de séries, charges -10 %. Ça laisse les articulations récupérer et tu repars plus fort." },
    { title: 'Sommeil', text: "7 à 9 h par nuit. C'est pendant le sommeil que le muscle se construit." },
    { title: 'Si tu n’as que 4 jours', text: "Supprime Jambes B et ajoute le soulevé de terre roumain (3 × 6-8) au début de Jambes A." },
  ],

  steps: {
    goals: { masse: 8000, seche: 10000 },
    tips: [
      "En masse, environ 8 000 pas par jour : bon pour la santé et la récupération, sans brûler les calories que tu essaies de prendre.",
      "En sèche, vise 10 000 pas ou plus. C'est le moyen le plus simple de brûler 300 à 400 kcal de plus par jour sans fatiguer tes séances.",
      "Le compteur en direct marche seulement quand l'appli est ouverte, avec l'écran allumé (téléphone en main ou dans la poche). Une appli web ne peut pas compter en arrière-plan.",
      "Pour le total de toute la journée, le plus fiable est le raccourci « Mes pas » : il récupère les vrais pas d'Apple Santé (iPhone et Apple Watch), puis tu les colles ici d'un bouton.",
      "Une appli web n'a pas le droit de lire Apple Santé directement : Apple réserve ça aux applis de l'App Store. Le raccourci fait le pont entre les deux.",
    ],
  },

  nutrition: {
    phases: {
      masse: {
        label: 'Prise de masse',
        goal: '74 → 85 kg, environ +0,3 à +0,5 kg par semaine',
        targets: { kcal: 3000, p: 175, g: 385, l: 80 },
        meals: [
          { id: 'm1', name: 'Petit-déjeuner', kcal: 825, p: 42, g: 101, l: 27,
            items: ["100 g de poudre d'avoine en porridge (avec le lait, 2 min au micro-ondes)", '300 ml de lait demi-écrémé', '1 banane coupée dedans', '3 œufs (omelette ou brouillés)'] },
          { id: 'm2', name: 'Déjeuner', kcal: 790, p: 52, g: 106, l: 14,
            items: ['125 g de riz (poids cru), soit environ 375 g cuit', '180 g de blanc de poulet (cru)', 'Légumes à volonté', "1 c. à soupe d'huile d'olive"] },
          { id: 'm3', name: 'Shaker avoine (collation / avant la séance)', kcal: 620, p: 33, g: 83, l: 17,
            items: ["60 g de poudre d'avoine", '300 ml de lait demi-écrémé', '1 banane', '100 g de skyr (ou 1 dose de whey)', '15 g de beurre de cacahuète', 'Tout au blender ou au shaker, à boire 1 h à 1 h 30 avant la séance'] },
          { id: 'm4', name: 'Dîner', kcal: 780, p: 47, g: 98, l: 20,
            items: ['125 g de pâtes (poids cru) ou 450 g de pommes de terre', '150 g de bœuf haché 5 % (ou saumon, thon, dinde)', 'Légumes', "1 c. à soupe d'huile d'olive"] },
        ],
      },
      seche: {
        label: 'Sèche',
        goal: '85 → 75 kg, environ -0,5 à -0,75 kg par semaine',
        targets: { kcal: 2300, p: 180, g: 260, l: 55 },
        meals: [
          { id: 's1', name: 'Petit-déjeuner', kcal: 590, p: 45, g: 65, l: 15,
            items: ["60 g de poudre d'avoine (porridge ou shaker)", '30 g de whey (ou 200 g de skyr)', '1 banane', '2 œufs'] },
          { id: 's2', name: 'Déjeuner', kcal: 615, p: 55, g: 73, l: 9,
            items: ['80 g de riz (poids cru)', '200 g de blanc de poulet (cru)', '200 g de légumes', "1 c. à café d'huile d'olive"] },
          { id: 's3', name: 'Collation', kcal: 320, p: 28, g: 33, l: 8,
            items: ['250 g de skyr ou fromage blanc 0 %', '1 fruit', '15 g d’amandes'] },
          { id: 's4', name: 'Avant la séance', kcal: 165, p: 5, g: 32, l: 2,
            items: ['1 banane', '1 yaourt nature'] },
          { id: 's5', name: 'Dîner', kcal: 610, p: 45, g: 61, l: 19,
            items: ['300 g de pommes de terre', '180 g de bœuf haché 5 % ou poisson', '200 g de légumes', "1 c. à soupe d'huile d'olive"] },
        ],
      },
    },
    tips: [
      "Pèse-toi chaque matin à jeun, après être passé aux toilettes, et note-le dans l'onglet Suivi. Seule la moyenne de la semaine compte : le poids d'un jour à l'autre varie beaucoup.",
      "En masse : si ta moyenne ne bouge pas pendant 2 semaines, ajoute 200 kcal (par exemple +50 g de riz cru, ou 40 g de poudre d'avoine dans un verre de lait). Si tu prends plus de 0,7 kg par semaine, enlève 200 kcal : c'est du gras.",
      "Du mal à tout manger ? Bois une partie de tes calories : le shaker avoine passe tout seul. Pour monter à environ 700 kcal, mets 80 g de poudre d'avoine, 400 ml de lait, 1 banane et 20 g de beurre de cacahuète.",
      "La poudre d'avoine, c'est la même chose que les flocons (environ 375 kcal, 13 g de protéines et 60 g de glucides pour 100 g), mais en plus pratique. Idées : porridge, shaker, pancakes (50 g de poudre, 2 œufs et 1 banane écrasée, à la poêle) ou 30 g mélangés dans un skyr.",
      "Des protéines à chaque repas (viande, poisson, œufs, skyr).",
      "Créatine monohydrate, 5 g par jour, tous les jours, même les jours de repos. C'est le complément le plus prouvé, et il n'est pas cher. La whey est pratique mais pas obligatoire.",
      "Bois 2 à 3 L d'eau par jour, un peu plus avec la créatine.",
      "En sèche : garde exactement le même programme et les mêmes charges lourdes. C'est ce qui dit à ton corps de garder le muscle.",
    ],
  },
};
