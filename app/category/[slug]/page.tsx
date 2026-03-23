import CategoryPageClient from './CategoryPageClient';

// Next.js 15: `params` is a Promise. Next.js 14: `params` is a plain object.
// `await Promise.resolve(params)` works for both.
type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);
  return <CategoryPageClient slug={slug} />;
}
