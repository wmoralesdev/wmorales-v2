// import { Book } from 'lucide-react';
// import { getTranslations, setRequestLocale } from 'next-intl/server';
// import { searchBlogPosts } from '@/app/actions/blog.actions';
// import { Searchbar } from '@/components/blog/searchbar';
// import { InnerHero } from '@/components/common/inner-hero';
// import { PostCard } from '@/components/markdown/post-card';
// import type { BlogPost } from '@/lib/types/blog.types';

// type SearchParams = {
//   q?: string;
//   tags?: string | string[];
//   sort?: string;
//   featured?: string;
// };

// type PageProps = {
//   params: Promise<{ locale: string }>;
//   searchParams: Promise<SearchParams>;
// };

// function parseSearchParams(params: SearchParams) {
//   const query = params.q || '';
//   let tags: string[] = [];
//   if (Array.isArray(params.tags)) {
//     tags = params.tags;
//   } else if (params.tags) {
//     tags = [params.tags];
//   }
//   const sortBy = params.sort || 'date-desc';
//   const featuredOnly = params.featured === 'true';

//   return { query, tags, sortBy, featuredOnly };
// }

// function BlogResults({
//   posts,
//   query,
//   tags,
//   featuredOnly,
//   showingFiltered,
//   filteredCount,
//   totalCount,
//   featuredPosts,
//   shouldShowFeatured,
// }: {
//   posts: BlogPost[];
//   query: string;
//   tags: string[];
//   featuredOnly: boolean;
//   showingFiltered: boolean;
//   filteredCount: number;
//   totalCount: number;
//   featuredPosts: BlogPost[];
//   shouldShowFeatured: boolean;
// }) {
//   const hasActiveFilters = query || tags.length > 0 || featuredOnly;
//   const sectionTitle = hasActiveFilters ? 'Search Results' : 'Recent Posts';

//   return (
//     <>
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="font-semibold text-2xl text-white">{sectionTitle}</h2>
//         {showingFiltered && (
//           <span className="text-gray-400 text-sm">
//             {filteredCount} of {totalCount} posts
//           </span>
//         )}
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {posts.map((post) => (
//           <PostCard key={post.slug} post={post} />
//         ))}
//       </div>

//       {/* Featured posts section */}
//       {shouldShowFeatured && featuredPosts.length > 0 && (
//         <div className="mt-16">
//           <div className="mb-6 flex items-center gap-2">
//             <Book className="h-6 w-6 text-purple-400" />
//             <h2 className="font-semibold text-2xl text-white">
//               Featured Posts
//             </h2>
//           </div>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {featuredPosts.map((post) => (
//               <PostCard key={`featured-${post.slug}`} post={post} />
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// function EmptyState({
//   query,
//   tags,
//   featuredOnly,
//   totalPosts,
//   t,
// }: {
//   query: string;
//   tags: string[];
//   featuredOnly: boolean;
//   totalPosts: number;
//   t: any;
// }) {
//   const hasFilters = query || tags.length > 0 || featuredOnly;

//   return (
//     <div className="py-12 text-center">
//       <div className="mx-auto max-w-md rounded-lg border border-gray-800 bg-gray-900/60 p-8 backdrop-blur-xl">
//         <h3 className="mb-2 font-semibold text-white text-xl">
//           {t('noResults')}
//         </h3>
//         <p className="mb-4 text-gray-400">
//           {hasFilters
//             ? 'Try adjusting your search or filters'
//             : 'No posts have been published yet'}
//         </p>
//         {hasFilters && (
//           <p className="text-gray-500 text-sm">
//             Total posts available: {totalPosts}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default async function BlogPage({ params, searchParams }: PageProps) {
//   const { locale } = await params;
//   const searchParamsData = await searchParams;
//   const { query, tags, sortBy, featuredOnly } =
//     parseSearchParams(searchParamsData);

//   // Enable static rendering
//   setRequestLocale(locale);

//   // Get translations
//   const t = await getTranslations('blog');

//   // Use server actions for better SSR performance
//   const searchResults = await searchBlogPosts({
//     query,
//     tags,
//     sortBy,
//     featuredOnly,
//   });

//   const {
//     posts: filteredPosts,
//     totalCount,
//     filteredCount,
//     availableTags,
//   } = searchResults;

//   // Get featured posts for the featured section (only when no filters are active)
//   const shouldShowFeatured = !query && tags.length === 0 && !featuredOnly;
//   const featuredPosts: BlogPost[] = shouldShowFeatured
//     ? (filteredPosts
//         .filter((post: BlogPost) => post.entry.featured)
//         .slice(0, 3) as BlogPost[])
//     : [];

//   const hasResults = filteredPosts.length > 0;
//   const showingFiltered = filteredCount !== totalCount;

//   return (
//     <div className="min-h-screen">
//       <InnerHero
//         description={t('description')}
//         icon={Book}
//         title={t('title')}
//       />

//       <div className="container mx-auto px-4 py-8 pt-16">
//         <Searchbar
//           availableTags={availableTags}
//           filteredCount={filteredCount}
//           query={query}
//           showFeatured={featuredOnly}
//           sortBy={sortBy}
//           tags={tags}
//           totalPosts={totalCount}
//         />

//         <section className="mx-auto max-w-6xl">
//           {hasResults ? (
//             <BlogResults
//               featuredOnly={featuredOnly}
//               featuredPosts={featuredPosts}
//               filteredCount={filteredCount}
//               posts={filteredPosts}
//               query={query}
//               shouldShowFeatured={shouldShowFeatured}
//               showingFiltered={showingFiltered}
//               tags={tags}
//               totalCount={totalCount}
//             />
//           ) : (
//             <EmptyState
//               featuredOnly={featuredOnly}
//               query={query}
//               tags={tags}
//               totalPosts={totalCount}
//               t={t}
//             />
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }
