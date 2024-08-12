import { getAllTags } from '@/src/shared/api';
import { CreateArticleForm } from '@/src/features/create-article';

export const CrateArticlePage = async () => {
  try {
    const res = await getAllTags();
    return <CreateArticleForm tagList={res.tags} />;
  } catch (_) {
    return <CreateArticleForm tagList={[]} />;
  }
};
