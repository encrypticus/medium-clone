export const queryKeys = {
  articles: {
    all: ['articles'],
    byPage: (offset: number) => ['articles', offset],
    article: {
      bySlug: (slug: string) => ['article', slug],
    },
  },

  profiles: {
    all: ['profiles'],
    profile: {
      byUserName: (userName: string) => ['profiles', userName],
    },
  },
};
