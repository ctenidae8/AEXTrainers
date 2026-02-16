```ts
export interface Message {
  role: 'user' | 'assistant'
  text: string
}

export interface Exhibit {
  title: string
  session: string
  content: string
}

export interface SessionInfo {
  id: number | string
  label: string
  title: string
  desc: string
}
```
