export const Routes = {
  client: {
    home: '/',
    signIn: '/sign-in',
    signUp: '/sign-up',
    signOut: '/sign-out',
    settings: '/settings',
    articles: {
      index: '/articles',
      create: '/articles/create',
      article: (slug: string) => `/articles/${slug}`,
      edit: (slug: string) => `/articles/edit/${slug}`,
    },
  },
  api: {
    auth: '/api/auth',
  },
};
