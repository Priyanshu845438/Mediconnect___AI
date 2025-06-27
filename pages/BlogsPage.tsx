
import React from 'react';
import { MOCK_BLOG_POSTS, APP_NAME } from '../constants.ts';
import BlogPostCard from '../components/BlogPostCard';
import { BlogPost } from '../types';

const BlogsPage: React.FC = () => {
  return (
    <div className="bg-extralight py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{APP_NAME} Blog</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Stay informed with the latest health tips, news, and insights from our medical experts.
          </p>
        </header>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_BLOG_POSTS.map((post: BlogPost) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        
        {/* Placeholder for a featured blog post or a CTA */}
        <section className="mt-16 md:mt-24 text-center bg-white p-8 md:p-12 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-dark mb-6">Have a topic you'd like us to cover?</h2>
            <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            We are always looking to provide valuable information to our community. Let us know what health topics interest you the most!
            </p>
            <a href="#/contact" className="bg-primary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors text-lg">
                Suggest a Topic
            </a>
        </section>
      </div>
    </div>
  );
};

export default BlogsPage;