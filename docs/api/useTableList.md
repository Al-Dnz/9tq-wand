---
title: useTableList
order: 3
nav:
  title: API
  order: -1
group:
  title: Hooks
  order: 2
---

# useTableList

Ce hook permet de gérer les tableaux de données.

- `name` *(required)* : Nom de l'objet à récupérer dans la réponse du serveur GraphQL.
- `options`:
  - `query`: Requête GraphQL à éxécuter pour récupérer la liste.
  - `debug` : un booléen qui indique si le mode de débogage est activé ou non. La valeur par défaut est false.
  - `paginate` : un booléen qui indique si la pagination est activée ou non. La valeur par défaut est true.
  - `params` : un objet qui contient les paramètres à ajouter à la requête GraphQL.
  - `variables` : un objet qui contient les variables à passer à la requête GraphQL.
- `searchOptions` : un objet qui contient les options de recherche. Il contient les champs suivants :
  - `key` : une chaîne de caractères qui indique la clé à utiliser pour stocker les paramètres de recherche dans le local-storage, `name` par défaut.
  - `definition` : un objet qui décrit le modèle de données de la recherche.
  - `updateLocation` : un booléen qui indique si l'URL doit être mise à jour ou non. La valeur par défaut est false.


## Valeur de retour

Le hook renvoie un objet contenant plusieurs propriétés :

- `records` : un tableau qui contient les données récupérées.
- `data` : l'objet de réponse complet de la requête GraphQL.
- `loading` : un booléen qui indique si la requête est en cours de chargement ou non.
- `pagination` : un objet qui contient les informations de pagination, à utiliser tel quel dans la props pagination des table antd.
- `search` : un objet qui contient les paramètres de recherche actuels.
- `setExtraParams` : une fonction qui permet de définir des paramètres supplémentaires pour la requête.
- `refetch` : une fonction qui permet de relancer la requête.
- `onReset` : une fonction qui permet de réinitialiser les paramètres de recherche et de relancer la requête.
- `onSearchChange` : Fonction à utiliser pour modifier la valeur des paramètre de recherche, peut être utiliser dans la props onChange de ant-form.

## Usage

```tsx | pure
import { useSearchFilters } from '@9troisquarts/wand';
import { gql } from '@apollo/client';

const searchDefinition = {
  search: 'String',
  startAfter: 'Date'
};

const GET_RECORDS_LIST = gql`
  query records($search: SearchRecordsAttributes) {
    records(search: $search) {
      records {
        id
        name
        startingOn
      }
      pagination {
        page
        perPage
        total
      }
    }
  }
`;

export const () => {
  const {
    records: clients,
    onSearchChange,
    onReset,
    search,
    refetch,
  } = useTableList<RecordType>('records', 
    { query: GET_RECORDS_LIST },
    { definition: searchDefinition, updateLocation: true }
  );
}

```
