import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import BlogPostComponent from "@/components/BlogPost";
import { useState } from "react";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  // Get unique categories
  const categories = ["All", ...new Set(posts?.map(post => post.category) || [])];
  
  // Filter posts by category
  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts?.filter(post => post.category === activeCategory);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-red-500">Failed to load blog posts</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Blog Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <a href="/" className="block">
              <img 
                src="https://cdn.prod.website-files.com/5e6ba7d73bd4764a57337c92/63763e5a734dba9279e9696d_Change_Logo_Full_Black%402x-p-2600.png" 
                alt="Change logo" 
                className="h-8 dark:hidden"
              />
              <img 
                src="https://cdn.prod.website-files.com/5e6ba7d73bd4764a57337c92/63763e5a734dba9279e9696d_Change_Logo_Full_Black%402x-p-2600.png" 
                alt="Change logo" 
                className="h-8 hidden dark:block invert"
              />
            </a>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Download app
              </a>
              <div className="flex items-center">
                <img 
                  src="https://cdn.prod.website-files.com/5e6ba7d73bd4764a57337c92/6724a41f5469b6c95d144c12_GB.png" 
                  alt="English" 
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Change Blog</h1>
        </header>
        
        {/* Blog Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === category
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts?.map((post) => (
            <BlogPostComponent key={post.id} post={post} />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Next
          </button>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-16 p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-lg">
          CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 63% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
        </div>
      </div>
    </div>
  );
}
