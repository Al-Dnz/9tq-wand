---
title: InlineFilters
nav:
  title: API
  order: -1
group:
  title: Components
  order: 0
---

# InlineFilters

## Demo

```tsx
import { useState } from 'react';
import { Space } from 'antd';
import { InlineFilters } from '@9troisquarts/wand';
import { UserOutlined } from '@ant-design/icons';

export default () => {
  const [search, setSearch] = useState({ activeOn: '2023-11-12' })

  const onReset = () => setSearch({ activeOn: '2023-11-12' })
  return (
    <Space direction="vertical" wrap>
      <InlineFilters
        value={search}
        onReset={onReset}
        resetText="Réinitialiser les filtres"
        toggle={{
          key: 'projects',
          text: 'Filtres',
          selectAllText: 'Tous les fitlres',
          // icon: <UserOutlined />
        }}
        onChange={setSearch}
        schema={[
          {
            name: 'nameEq',
            icon: <UserOutlined />,
            title: 'Nom utilisateur',
            toggleable: false,
            style: {
              width: 300,
            },
            input: {
              type: 'string',
              inputProps: {
                placeholder: 'Rechercher par nom...'
              }
            }
          },
          {
            name: 'activeOn',
            label: 'Actif le',
            toggleable: false,
            input: {
              type: 'date',
              inputProps: {
                format: (value) => `Actif le ${value.format('L')}`,     
              }
            }
          },
          {
            name: ['startingOn', 'endingOn'],
            title: 'Activité (range)',
            label: 'Actif entre le',
            input: {
              type: 'daterange',
              inputProps: {
                format: 'L',
                placeholder: ['Début', 'Fin']
              }
            }
          },
          {
            name: 'users',
            label: 'Utilisateur',
            icon: <UserOutlined />,
            input: {
              type: 'select',
              inputProps: {
                options: [{ value: 'HP', label: 'Harry Potter' }, { value: 'DM', label: 'Drago Malefoy' }],
                noOptionsFound: 'Aucun utilisateur ne correspond',
                multiple: false
              },
            }
          },
          {
            name: 'onlyMine',
            label: 'Uniquement les miens',
            icon: <UserOutlined />,
            input: {
              type: 'boolean'
            }
          },
          {
            name: 'clients',
            label: 'Clients',
            title: 'Clients (multiple)',
            input: {
              type: 'select',
              inputProps: {
                options: [{ value: 'HP', label: 'Harry Potter' }, { value: 'DM', label: 'Drago Malefoy' }],
                multiple: true,
                searchPlaceholder: 'Rechercher...',
                selectAllText: 'Tous les clients',
              }
            }
          }
        ]}
      />
    </Space>
  )
}
```


## API

| Propriété | Type | Description |
| --- | --- | --- |
| `value` | `object` | ```required``` Current filter values |
| `resetText` | `string` |  text displayed on the reset button. |
| `toggle` | `ToggleProps` |  filter toggler configuration. |
| `onChange` | `function` | function called when filter values change. |
| `onReset` | `(values: object) => void` | function execute when the reset button is clicked. |
