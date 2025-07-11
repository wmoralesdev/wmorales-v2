import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', // Use 'local' for development, will change to 'github' for production
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'URL Slug',
            description: 'The URL path for this post',
          },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { length: { min: 50, max: 160 } },
        }),
        publishedAt: fields.date({
          label: 'Published Date',
          defaultValue: { kind: 'today' },
        }),
        featured: fields.checkbox({
          label: 'Featured Post',
          defaultValue: false,
        }),
        tags: fields.multiselect({
          label: 'Tags',
          options: [
            { label: 'AI/ML', value: 'ai-ml' },
            { label: 'Web Development', value: 'web-dev' },
            { label: 'DevOps', value: 'devops' },
            { label: 'Career', value: 'career' },
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'Cursor', value: 'cursor' },
          ],
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/blog/images',
          validation: { isRequired: true },
          publicPath: '/blog/images/',
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/blog/images',
              publicPath: '/blog/images/',
            },
          },
        }),
      },
    }),
  },
});