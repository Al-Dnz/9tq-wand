---
title: CSVNotice
nav:
  title: API
  order: -1
group:
  title: Components
  order: 0
---

# CSV Notice

Le composant CSVNotice est utilisé pour afficher un aperçu du format attendu pour l'import de fichiers CSV.

## Usage

```tsx | pure
import { CSVNotice } from '@9troisquarts/wand';
```

```tsx
import React from 'react';
import { CSVNotice } from '@9troisquarts/wand';
import 'antd/dist/antd.css';

export default () => {
  const schema = [
    {
      header: 'nom',
      description: "Nom de l'utilisateur",
    },
    {
      header: 'firstname',
      description: "Prénom de l'utilisateur",
    },
    {
      header: 'state',
      description: "Status de l'utilisateur",
      values: [
        {
          value: 'draft',
          description: 'Brouillon',
        },
        {
          value: 'published',
          description: 'Publiée',
        },
      ],
    },
  ];
  return <CSVNotice schema={schema} />;
};
```

## API


### CSVNotice

| Nom | description | Type | Default |
|---|---|---|---|
| **schema** |   | Array<[CSVNoticeItem](/api/csv#csvnoticeitem)> | ```required``` |


### CSVNoticeItem

| Nom | description | Type | Default |
|---|---|---|---|
| **header** | Nom du header | string | ```required``` |
| **description**  | Description de la colonne | string | ```required``` |
| **values**  | Liste des valeurs possibles | Array<[CSVNoticeItemValue](/api/csv#csvnoticeitemvalue)> |  |

### CSVNoticeItemValue
| Nom | description | Type | Default |
|---|---|---|---|
| **value** |  | string | ```required``` |
| **description** |  | string |  |

