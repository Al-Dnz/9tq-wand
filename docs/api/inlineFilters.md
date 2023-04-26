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
import { Space } from 'antd';
import { InlineFilters } from '@9troisquarts/wand';
import { UserOutlined } from '@ant-design/icons';

export default () => {


  return (
    <Space direction="vertical">
      <InlineFilters
        value={{}}
        onReset={() => console.log("reset")}
        resetText="Réinitialiser les filtres"
        onChange={(object) => console.log(object)}
        schema={[
          {
            name: 'nameEq',
            icon: <UserOutlined />,
            input: {
              type: 'string',
              placeholder: 'Rechercher par nom...'
            }
          },
          {
            name: 'activeOn',
            label: 'Actif le',
            input: {
              type: 'date',
              inputProps: {
                format: (value) => `Actif le ${value.format('L')}`,     
              }
            }
          },
          {
            name: 'users',
            label: 'Utilisateurs',
            icon: <UserOutlined />,
            input: {
              type: 'select',
              options: [{ value: 'HP', label: 'Harry Potter' }, { value: 'DM', label: 'Drago Malefoy' }],
              noOptionsFound: 'Aucun utilisateur ne correspond',
              multiple: false,
            }
          },
          {
            name: 'clients',
            label: 'Clients',
            input: {
              type: 'select',
              options: [{ value: 'HP', label: 'Harry Potter' }, { value: 'DM', label: 'Drago Malefoy' }],
              multiple: true,
              searchPlaceholder: 'Rechercher...',
            }
          }
        ]}
      />
    </Space>
  )
}
```


## API

### NtqToolbarProvider

| Nom | Description | Type | Default |
|---|---|---|---|
| **enabled** | | boolean | true |
| **impersonation** | Enabled or disabled impersonation | boolean \| { userTypes: string[] } | false |
| **baseUrl** | Enabled or disabled impersonation | string | /ntq_tools |

### NtqToolbar

| Nom | Description | Type | Default |
|---|---|---|---|
| **enabled** | Hide/Show the toolbar | boolean | true |

