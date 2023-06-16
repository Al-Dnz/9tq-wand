---
title: Excelsior Modal
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
import { ExcelsiorImportModalContent } from '@9troisquarts/wand';
import { UserOutlined } from '@ant-design/icons';

export default () => {

  return (
    <Space direction="vertical" wrap>
      <ExcelsiorImportModalContent
        open
        allowImportOnError
        debug
        importType="users"
        title="Users"
        importer={{ state: "checked" }}
        importFile={{ state: "checked", errors_count: 500, success_count: 100, create_count: 50, update_count: 55 }}
        onCompleted={() => console.log("completed")}
      />
    </Space>
  )
}
```


## API
