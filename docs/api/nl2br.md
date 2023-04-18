---
title: nl2br
nav:
  title: API
  order: -1
group:
  title: Utils
  order: 4
---

# nl2br

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

