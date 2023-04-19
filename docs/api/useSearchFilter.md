---
title: useSearchFilter
order: 2
nav:
  title: API
  order: -1
group:
  title: Hooks
  order: 2
---

# useSearchFilter

Ce hook permet de gérer les filtres de recherche et l'actualisation dans l'url.

Il prend deux arguments :

- `key` Chaîne de caractères utilisée pour identifier les filtres de recherche dans le local-storage.
- `options` un objet qui peut contenir les propriétés suivantes :
  - `debug` un booléen indiquant s'il faut activer le mode de débogage ou non.
  - `defaultSearch` un objet contenant les valeurs par défaut des filtres de recherche.
  - `definition` un objet représentant la définition du modèle pour la conversion d'attributs. (cf. [ModelDefinition](/9tq-wand/api/model-definition))
  - `enabled` *(true par défaut)* un booléen indiquant si la fonctionnalité de filtre de recherche doit être activée ou non.
  - `updateLocation` un booléen indiquant si les filtres de recherche doivent être reflétés dans l'URL.


## Valeur de retour

Le hook renvoie un objet contenant plusieurs propriétés :

- `search` : un objet contenant les valeurs actuelles des filtres de recherche.
- `page` : le numéro de page actuel.
- `perPage` : le nombre d'éléments par page.
- `set` : une fonction pour définir les valeurs des filtres de recherche.
- `onPageChange` : une fonction pour gérer les événements de changement de page.
- `onReset` : une fonction pour réinitialiser les filtres de recherche.
- `onChange` : une fonction pour gérer les événements de changement des filtres de recherche.


## Usage

```tsx | pure
import { useSearchFilters } from '@9troisquarts/wand';

const searchDefinition = {
  search: 'String',
  startAfter: 'Date'
};

export const () => {
  const {
    page,
    perPage,
    search,
    onPageChange,
    onReset,
    onChange
  } = useSearchFilters('users', {
    defaultSearch: { search: 'Test' },
    definition: searchDefinition,
    updateLocation: true,
  });
}

```
