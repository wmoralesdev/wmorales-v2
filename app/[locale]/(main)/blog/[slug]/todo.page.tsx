// import { createReader } from '@keystatic/core/reader';
// import Markdoc from '@markdoc/markdoc';
// import { ArrowLeft } from 'lucide-react';
// import type { Metadata } from 'next';
// import Link from 'next/link';
// import { notFound } from 'next/navigation';
// import React from 'react';
// import readingTime from 'reading-time';
// import { trackView } from '@/app/actions/blog.actions';
// import { MarkdownComponents } from '@/components/markdown';
// import { ReadingProgress } from '@/components/markdown/reading-progress';
// import { ShareButtons } from '@/components/markdown/share-buttons';
// import keystaticConfig from '@/keystatic.config';
// import { markdocConfig } from '@/lib/blog/markdoc';
// import { formatDate } from '@/lib/blog/utils';

// const reader = createReader(process.cwd(), keystaticConfig);

// export async function generateStaticParams() {
//   const posts = await reader.collections.posts.all();
//   return posts.map((post) => ({ slug: post.slug }));
// }

// type Params = Promise<{ slug: string }>;

// export async function generateMetadata({
//   params,
// }: {
//   params: Params;
// }): Promise<Metadata> {
//   const { slug } = await params;
//   const post = await reader.collections.posts.read(slug);

//   if (!post) {
//     return {
//       title: 'Post Not Found',
//     };
//   }

//   return {
//     title: `${post.title} | Walter Morales`,
//     description: post.description,
//     openGraph: {
//       title: post.title,
//       description: post.description,
//       type: 'article',
//       publishedTime: post.publishedAt || undefined,
//       authors: ['Walter Morales'],
//       images: post.coverImage ? [post.coverImage] : undefined,
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: post.title,
//       description: post.description,
//       images: post.coverImage ? [post.coverImage] : undefined,
//     },
//   };
// }

// export default async function BlogPost({ params }: { params: Params }) {
//   const { slug } = await params;
//   const post = await reader.collections.posts.read(slug);

//   if (!post) {
//     notFound();
//   }

//   // Track view
//   await trackView(slug);

//   // Parse content with enhanced Markdoc configuration
//   const { node } = await post.content();
//   const renderable = Markdoc.transform(node, markdocConfig);

//   // Get HTML content for reading time calculation
//   const htmlContent = Markdoc.renderers.html(renderable);
//   const plainText = htmlContent.replace(/<[^>]*>/g, ''); // Strip HTML tags
//   const stats = readingTime(plainText);

//   return (
//     <>
//       <ReadingProgress />
//       <article className="container mx-auto max-w-4xl px-4 py-12">
//         <Link
//           className="mb-8 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
//           href="/blog"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Blog
//         </Link>

//         <header className="mb-8">
//           <h1 className="mb-4 font-bold text-4xl">{post.title}</h1>
//           <div className="mb-4 flex items-center gap-4 text-gray-400">
//             {post.publishedAt && (
//               <>
//                 <time dateTime={post.publishedAt}>
//                   {formatDate(post.publishedAt)}
//                 </time>
//                 <span>·</span>
//               </>
//             )}
//             <span>{stats.text}</span>
//           </div>
//           {post.tags.length > 0 && (
//             <div className="mb-6 flex gap-2">
//               {post.tags.map((tag) => (
//                 <Link
//                   className="rounded-full bg-purple-900/30 px-3 py-1 text-sm transition-colors hover:bg-purple-900/50"
//                   href={`/blog/tags/${tag}`}
//                   key={tag}
//                 >
//                   {tag}
//                 </Link>
//               ))}
//             </div>
//           )}
//         </header>

//         <div className="prose prose-invert prose-lg max-w-none prose-code:rounded prose-img:rounded-lg prose-pre:border prose-pre:border-zinc-800 prose-blockquote:border-l-purple-600 prose-code:bg-zinc-800 prose-pre:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-headings:font-bold prose-strong:font-semibold prose-a:text-purple-400 prose-blockquote:text-gray-400 prose-code:text-purple-300 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-headings:text-white prose-ol:text-gray-300 prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 prose-p:leading-relaxed prose-a:no-underline prose-img:shadow-lg hover:prose-a:text-purple-300">
//           {(() => {
//             // Transform the renderable tree to replace pre tags with CodeBlock
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             const transformNode = (innerNode: any): any => {
//               if (!innerNode) {
//                 return innerNode;
//               }

//               // If it's a pre tag, transform it to CodeBlock
//               if (innerNode.$$mdtype === 'Tag' && innerNode.name === 'pre') {
//                 return {
//                   ...innerNode,
//                   name: 'CodeBlock',
//                   // Pass the language attribute and children directly
//                   attributes: {
//                     ...innerNode.attributes,
//                     children: innerNode.children?.[0] || '',
//                   },
//                   children: [],
//                 };
//               }

//               // Otherwise, recursively transform children
//               if (Array.isArray(innerNode.children)) {
//                 return {
//                   ...innerNode,
//                   children: innerNode.children.map(transformNode),
//                 };
//               }

//               return innerNode;
//             };

//             const transformedRenderable = transformNode(renderable);

//             return Markdoc.renderers.react(transformedRenderable, React, {
//               components: MarkdownComponents,
//             });
//           })()}
//         </div>

//         <footer className="mt-12 border-gray-800 border-t pt-8">
//           <ShareButtons title={post.title} url={`/blog/${slug}`} />
//         </footer>
//       </article>
//     </>
//   );
// }
