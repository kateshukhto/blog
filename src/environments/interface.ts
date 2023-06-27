export interface Environment{
  production: boolean,
  apiKey: string
}

export interface Post {
  id?: string,
  text: string,
  title: string,
  author: string,
  date: Date
}
