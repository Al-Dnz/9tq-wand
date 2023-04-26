---
title: NtqToolbar
nav:
  title: API
  order: -1
group:
  title: Components
  order: 0
---

# NtqToolbar

Le composant NtqToolbar permet d'afficher une barre d'outil permettant d'activer des fonctionnalités.

## Usage

```tsx | pure
import { NtqToolbar, NtqToolbarProvider } from "@9troisquarts/wand";

export default () => {
  return (
    <NtqToolbarProvider enabled impersonation>
      <NtqToolbar enabled />
      {/* Your code */}
    </NtqToolbarProvider>
  );
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

