export const Api = {
  home: '/',
  auth: {
    login: process.env.NEXT_PUBLIC_API_ENDPOINT + '/users/login',
    logOut: process.env.NEXT_PUBLIC_API_ENDPOINT + '/users/log-out',
    signup: process.env.NEXT_PUBLIC_API_ENDPOINT + '/users',
  },
  user: {
    getInfo: process.env.NEXT_PUBLIC_API_ENDPOINT + '/user',
    updateInfo: process.env.NEXT_PUBLIC_API_ENDPOINT + '/user',
  },
  articles: {
    list: process.env.NEXT_PUBLIC_API_ENDPOINT + '/articles',
    create: process.env.NEXT_PUBLIC_API_ENDPOINT + '/articles',
    delete: process.env.NEXT_PUBLIC_API_ENDPOINT + '/articles',
    getBySlug: (slug: string) =>
      process.env.NEXT_PUBLIC_API_ENDPOINT + `/articles/${slug}`,
    addToFavorites: (slug: string) =>
      process.env.NEXT_PUBLIC_API_ENDPOINT + `/articles/${slug}/favorite`,
  },
  tags: {
    getTagList: process.env.NEXT_PUBLIC_API_ENDPOINT + '/tags',
  },
  profiles: {
    follow: (username: string) =>
      process.env.NEXT_PUBLIC_API_ENDPOINT + `/profiles/${username}/follow`,
  },
  comments: {
    create: process.env.NEXT_PUBLIC_API_ENDPOINT + '/comments',
    delete: process.env.NEXT_PUBLIC_API_ENDPOINT + '/comments',
  },
};
