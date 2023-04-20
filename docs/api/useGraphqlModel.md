---
title: useGraphqlModel
order: 4
nav:
  title: API
  order: -1
group:
  title: Hooks
  order: 2
---

# useGraphqlModel

## Usage

```tsx | pure
import { useGraphqlModel, ModelDefinitionType } from '@9troisquarts/wand';
import { gql } from '@apollo/client';

const GET_USER_QUERY = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

const userDefinition: ModelDefinitionType = {
  firstName: 'String',
  lastName: 'String',
  email: 'String',
};

const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    firstName
    lastName
    email
  }
`

const useUser = useGraphqlModel<UserType>('user', {
  queries: {
    fetch: GET_USER_QUERY
  },
  flashMessages: true,
  definition: userDefinition,
  fragment: USER_FRAGMENT
});

export default (props) => {
  const {
    userId
  } = props;

  const {
    record: globalUser,
    errors,
    loading,
    submitting ,
    onSave,
  } = useUser(userId, { fetch: !!userId })

  return (
    <div>
    </div>
  )
}
```
