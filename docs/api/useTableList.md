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

Attention

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
  - `history` *(required)*: Objet qui contient les fonctions push et replace (non compatibles directement avec react-router-dom >6) - obligatoire pour utiliser la fonction de recherche dans l'url


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
import React from 'react';
import { Table } from 'antd';
import { gql } from '@apollo/client';
import { useTableList } from '@9troisquarts/wand';

// Requête GraphQL pour récupérer les utilisateurs avec pagination
const GET_USERS = gql`
  query getUsers($perPage: Int, $page: Int, $search: UserFilter) {
    users(perPage: $perPage, page: $page, search: $search) {
      id
      name
      email
    }
    pagination {
      page
      perPage
      total
    }
  }
`;

// Définition du modèle pour la recherche
const userModelDefinition = {
  name: { type: 'String' },
  email: { type: 'String' },
};

const UserList = () => {
  const {
    records: users,
    loading,
    pagination,
    search,
    onSearchChange,
    onReset,
  } = useTableList('users', {
    query: GET_USERS,
    paginate: true,
  }, {
    definition: userModelDefinition,
    history: () => {
      replace: (url) => undefined
    },
    updateLocation: false,
    key: 'users',
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  return (
    <div>
      <SearchBar value={search} onChange={onSearchChange} onReset={onReset} />
      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        pagination={pagination}
        rowKey="id"
      />
    </div>
  );
};

export default UserList;

```
