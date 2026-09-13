# Manuel utilisateur — ExpensePro

Guide d'utilisation de la plateforme de gestion des notes de frais de SUP Herman.

---

## Les trois rôles

Votre rôle est attribué par un manager et détermine les menus affichés.

| Rôle             | Ce que vous pouvez faire                                                       |
| ---------------- | ------------------------------------------------------------------------------ |
| **Employé**      | Créer des notes de frais, joindre des justificatifs, suivre leur avancement    |
| **Manager**      | Tout ce qui précède + valider ou refuser les notes de tous les employés, créer des comptes |
| **Comptabilité** | Consulter les notes validées et les marquer comme remboursées (traitées)       |

---

## Première connexion

Vous ne pouvez pas créer votre compte. Un manager vous transmet votre **email
professionnel** et un **mot de passe temporaire**.

1. Ouvrir `http://localhost:5173`
2. Saisir l'email et le mot de passe temporaire, puis **Se connecter**
3. Choisir votre mot de passe définitif — **8 caractères minimum** — et le confirmer

Un indicateur vert confirme que la règle des 8 caractères est respectée, et que
les deux saisies correspondent. Lors des connexions suivantes, utilisez ce nouveau
mot de passe (le temporaire ne sert plus).

**Mot de passe oublié** — contactez un manager, qui pourra vous recréer un accès.

---

## Repères communs

**La barre latérale** (à gauche) regroupe la navigation. Seules les entrées
correspondant à vos droits apparaissent : un employé n'y voit ni « Toutes les
notes » ni « Créer un compte ». Le bouton **Déconnexion** se trouve en bas.

**Sur mobile**, la barre se replie : le bouton en haut à gauche l'ouvre en tiroir.

**Les messages** apparaissent après chaque action, dans un encadré coloré — **vert**
en cas de réussite, **rouge** en cas de problème.

**L'icône œil** dans les champs mot de passe affiche ou masque la saisie.

**Les statuts**

| Statut       | Signification                                          |
| ------------ | ------------------------------------------------------ |
| **Créée**    | Soumise, en attente de la décision d'un manager        |
| **Validée**  | Approuvée par le manager, transmise à la comptabilité  |
| **Refusée**  | Rejetée ; le motif figure dans le détail               |
| **Traitée**  | Remboursée par la comptabilité                         |

---

## Guide de l'employé

### Mes notes de frais

Écran d'accueil après connexion. Il affiche :

- deux encarts récapitulatifs : le **montant en attente de validation** et le
  **montant remboursé ce mois** ;
- l'**historique** de vos notes, avec titre, montant, catégorie, statut et date.

Un clic sur une note (ou sur **Détails**) ouvre sa fiche complète : dates,
commentaire, éventuel **motif du manager** en cas de refus, et les pièces
justificatives (cliquables pour les ouvrir).

### Créer une note

Menu **Nouvelle note**, ou bouton **Soumettre une dépense**.

1. **Titre** de la dépense (ex. « Déjeuner client »).
2. **Montant** en euros et **date** de la dépense.
3. **Catégorie** : repas, transport, hébergement, fournitures ou autre.
4. **Commentaire** justificatif (facultatif mais recommandé).
5. **Pièces justificatives** — dans le panneau de droite : glissez-déposez vos
   fichiers dans la zone prévue, **ou** cliquez pour les sélectionner. Formats
   PNG, JPG ou PDF, 5 Mo maximum par fichier, 5 fichiers maximum. Chaque fichier
   ajouté apparaît dans une liste ; la croix permet de le retirer.
6. **Soumettre la note** — elle part au statut *Créée*.

**Si la note est refusée à la saisie**

| Message                                   | Solution                                 |
| ----------------------------------------- | ---------------------------------------- |
| Le titre est requis                       | Renseigner un titre                      |
| Le montant doit être un nombre positif    | Corriger le montant                      |
| « fichier » : format non autorisé         | N'utiliser que PNG, JPG ou PDF           |
| « fichier » : dépasse la limite de 5 Mo   | Réduire ou remplacer le fichier          |
| Maximum 5 fichiers                        | Retirer des pièces jointes               |

### Suivre vos notes

Sur *Mes notes de frais*, chaque ligne montre le statut à jour. Ouvrez le
**détail** d'une note pour consulter le motif d'un refus, ou vérifier qu'une note
validée a bien été traitée.

---

## Guide du manager

Vous disposez de toutes les fonctions de l'employé, plus le traitement des notes
et la création de comptes.

### Valider ou refuser une note

L'écran **Administration des notes** (ou *Toutes les notes*) liste les notes de
**tous les employés**, avec l'email de chacun.

1. Cliquer sur une note au statut **Créée** pour ouvrir sa fiche.
2. Ajouter éventuellement un **commentaire** (motif de la décision).
3. Choisir :
   - **Valider** (bouton vert) → la note passe en *Validée* et part vers la comptabilité ;
   - **Refuser** (bouton rouge) → la note passe en *Refusée*.

Rédiger un motif explicite en cas de refus : le collaborateur le retrouvera dans
le détail de sa note.

### Créer un compte

Écran **Créer un compte** (ou *Gestion des utilisateurs*).

| Champ         | Remarque                             |
| ------------- | ------------------------------------ |
| Prénom, Nom   | Obligatoires                         |
| Email         | Obligatoire, unique, sert d'identifiant |
| Rôle          | Employé, Manager ou Comptabilité     |

À la validation, un **mot de passe temporaire** s'affiche. **Notez-le : il n'est
affiché qu'une seule fois.** Communiquez au nouvel utilisateur son email **et** ce
mot de passe temporaire — il l'utilisera pour sa première connexion, puis choisira
son propre mot de passe.

---

## Guide de la comptabilité

Vous voyez uniquement les notes déjà **Validées** ou **Traitées** ; les notes en
attente de décision ne vous sont pas présentées.

1. Ouvrir **Administration des notes**.
2. Cliquer sur une note au statut **Validée** pour ouvrir sa fiche.
3. Cliquer sur **Marquer comme traitée** une fois le remboursement effectué : la
   note passe au statut *Traitée*.

---

## Profil et déconnexion

- **Mon profil** affiche vos informations : nom, email et rôle. Elles sont en
  lecture seule ; toute correction relève d'un manager.
- **Déconnexion** (en bas de la barre latérale) vous ramène à l'écran de connexion.

---

## Questions fréquentes

**Pourquoi ne puis-je pas créer mon compte ?**
Les comptes sont créés par un manager, qui vous transmet votre email et un mot de
passe temporaire.

**J'ai oublié mon mot de passe.**
Contactez un manager pour qu'il vous recrée un accès.

**Ma note reste au statut « Créée ».**
Elle attend qu'un manager la valide ou la refuse. Ce n'est pas un blocage.

**Pourquoi je ne vois pas « Administration des notes » ?**
Cette page est réservée aux managers et à la comptabilité.

**Ma note refusée, puis-je la modifier ?**
Non, une note ne se modifie pas après décision. Déposez-en une nouvelle si besoin.

**En tant que comptabilité, je ne vois pas une note qui vient d'être soumise.**
Normal : vous ne voyez que les notes **validées** et **traitées**. Une note en
attente doit d'abord être validée par un manager.

**L'application fonctionne-t-elle sur téléphone ?**
Oui, tous les écrans s'adaptent aux téléphones et tablettes ; le menu s'ouvre via
le bouton en haut à gauche.