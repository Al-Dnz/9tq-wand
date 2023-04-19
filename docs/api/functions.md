---
title: Functions
order: 100
nav:
  title: API
  order: -1
group:
  title: Utils
  order: 4
---

# Functions

## nl2br

```tsx | pure
import { nl2br } from '@9troisquarts/wand';

nl2br('Bonjour\nComment ça va ?')
```

```tsx
import { nl2br } from '@9troisquarts/wand';

export default () => {

  return (
    <div>
      {nl2br('Bonjour\nComment ça va ?')}
    </div>
  )
}

```

## capitalize

```tsx | pure
import { capitalize } from '@9troisquarts/wand';

capitalize('wand')
```

```tsx
import { capitalize } from '@9troisquarts/wand';

export default () => {

  return (
    <div>
      wand -> {capitalize('wand')}
    </div>
  )
}

```

## memoOnlyForKeys

```tsx | pure
import React from 'react';
import { memoOnlyForKeys } from '@9troisquarts/wand'

const Component = (props) => {
  const {
    value
  } = props;
  return (
    <div>
      I will rerender only if the props value changed
    </div>
  )
}

export default React.memo(Component, memoOnlyForKeys(['value']))
```
