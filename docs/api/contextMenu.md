---
title: ContextMenu
nav:
  title: API
  order: -1
group:
  title: Components
  order: 2
---

# ContextMenu

Ce composant est une implémentation d'un menu contextuel dans une liste déroulante lors d'un clique sur un bouton. 

## Usage

```tsx
import React from 'react';
import { ContextMenu } from '@9troisquarts/wand';
import 'antd/dist/antd.css';

export default () => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
  ];
  return <ContextMenu menu={{ items }} />;
};
```

## API

| Nom | Type | Description |
| --- | --- | --- |
| **className** | string | Une classe CSS optionnelle à appliquer au composant. |
| **size** | 'small' &#124; 'default' &#124; number | La taille du bouton de menu contextuel. |
| **menu** | [MenuProps](https://4x.ant.design/components/menu/#API) | ```required```
| **...** | [DropdownProps](https://4x.ant.design/components/dropdown/#API) | Autres props du dropdown |
