import { BlogPost } from '@shared/schema';

interface BlogPostProps {
  post: BlogPost;
}

export default function BlogPostComponent({ post }: BlogPostProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <a href={post.url} target="_blank" rel="noopener noreferrer">
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
          <img 
            src={post.imageUrl} 
            alt={`${post.title} thumbnail`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>{post.category}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h3>
        </div>
      </a>
    </div>
  );
}
