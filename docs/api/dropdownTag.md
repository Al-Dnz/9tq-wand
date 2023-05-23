---
title: DropdownTag
nav:
  title: DropdownTag
  order: -1
group:
  title: Components
  order: 0
---

# DropdownTag

## Usage

```tsx | pure
import { DropdownTag } from '@9troisquarts/wand';
```

```tsx
import React, { useState } from 'react';
import { DropdownTag } from '@9troisquarts/wand';
import 'antd/dist/antd.css';

export default () => {
  const [value, setValue] = useState('open');
  const options = [
    {
      value: 'open', 
      label: 'Open',
    },
    {
      value: 'close',
      label: 'Close'
    },
    {
      value: 'ongoing',
      label: 'Ongoing'
    }
  ]

  const colorForState = {
    open: 'orange',
    close: 'green',
    ongoing: 'geekblue'
  }
  return (
    <DropdownTag
     options={options}
     onChange={setValue}
     value={value}
     className="custom-class"
     color={value ? colorForState[value] : undefined}
    />
  );
};
```

## API

### DropdownTag
| Nom | description | Type | Default |
|---|---|---|---|
| **value** | | string, number | ```required``` |
| **options** | List of option displayed in dropdown | Option[] | ```required``` |
| **className** | | string |  |
| **style** | | CSSProperties |  |
| **undefinedText** | Text to display when value is undefined | string |  |
| **children** | Element displayed instead of value when present | ReactNode, ReactNode[] |  |

### Option

| Nom | description | Type | Default |
|---|---|---|---|
| **value** |   | string, number | ```required``` |
| **label** |   | string, ReactNode | ```required``` |

