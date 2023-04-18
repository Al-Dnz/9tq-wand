---
title: ModelDefinition
nav:
  title: API
  order: -1
group:
  title: Utils
  order: 2
---

# ModelDefinition

Permet de caster un objet JS vers un format qui peut être compris par le backend

## Usage

```tsx | pure
import { ModelDefinition } from '@9troisquarts/wand';
import moment from 'moment';

const UserDefinition = new ModelDefinition({
  username: 'String',
  birthdate: 'Date',
  date: 'Date',
  email: 'String',
  password: 'Password',
  passwordConfirmation: 'Password',
});

const user = {
  username: '9tq',
  fake: 'fake',
  birthdate: '2021-11-11',
  date: moment(),
};

const params = UserDefinition.parse(user);
// OUTPUT : { username: '9tq', birthdate: '2021-11-11' }
```

## Type de champ disponibles

- ID
- String
- Integer
- Float
- Password
- File
- Files
- Boolean
- Array
- ```ModelDefinition```
- Nested (utilisé pour transformer la clé dans un format valide pour les nested attributes de rails) 
- Places

### Places
