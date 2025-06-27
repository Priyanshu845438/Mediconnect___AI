
import React from 'react';
import { BlogPost } from '../types';
import { ArrowRightIcon } from './icons/OutlineIcons';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transform hover:shadow-2xl transition-shadow duration-300">
      <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-dark mb-2">{post.title}</h3>
        <div className="text-xs text-gray-500 mb-3">
          <span>By {post.author}</span> | <span>{post.date}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{post.excerpt}</p>
        <a href={`#/blog/${post.id}`} className="text-primary hover:text-teal-700 font-semibold transition-colors inline-flex items-center self-start">
          Read More <ArrowRightIcon className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default BlogPostCard;
