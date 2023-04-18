---
title: AutoLink
nav:
  title: API
  order: -1
group:
  title: Components
  order: 0
---

# AutoLink

Le composant AutoLink est une classe React qui permet de transformer les liens présents dans un texte en liens cliquables dans une page web. Le texte peut contenir des URL ou des adresses email, et ces adresses seront automatiquement transformées en liens.

## Usage

```tsx | pure
import { AutoLink } from '@9troisquarts/wand';
```

```tsx
import React from 'react';
import { AutoLink } from '@9troisquarts/wand';

export default () => {
  return (
    <>
      <AutoLink text="Ceci est un lien \n https://www.google.com" />
    </>
  );
};
```

## API

| Propriété | Type | Description |
| --- | --- | --- |
| `text` | `string` | ```required``` Le texte à analyser |

