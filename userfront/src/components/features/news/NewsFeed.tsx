'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { newsService, News } from '@/services/news.service';
import { NewsHero } from './NewsHero';
import { NewsCard } from './NewsCard';
import { NewsFilter, NewsHeroSkeleton, NewsCardSkeleton } from './NewsFilter';

export const NewsFeed = () => {
  const [allNews, setAllNews] = useState<News[]>([]);
  const [featuredNews, setFeaturedNews] = useState<News | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const news = await newsService.getNews();
      const featured = await newsService.getFeaturedNews();
      setAllNews(news);
      setFeaturedNews(featured || null);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredNews = allNews.filter(n => 
    selectedCategory === "All" || n.category === selectedCategory
  );

  // We exclude the featured post from the grid if we are in "All" view to avoid duplication
  const gridNews = selectedCategory === "All" 
    ? filteredNews.filter(n => n.id !== featuredNews?.id)
    : filteredNews;

  if (loading) {
    return (
      <div className="space-y-12">
        <NewsHeroSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => <NewsCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* 1. News Hero - Featured item (Only show if in "All" or if it matches category) */}
      <AnimatePresence mode="wait">
        {selectedCategory === "All" && featuredNews && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NewsHero news={featuredNews} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Filter Tabs */}
      <div className="sticky top-[88px] z-30 bg-background/80 backdrop-blur-3xl px-2">
         <NewsFilter 
            selectedCategory={selectedCategory} 
            onSelect={setSelectedCategory} 
         />
      </div>

      {/* 3. Hybrid Grid/List Feed */}
      <div className="space-y-12">
        <div className="flex items-center gap-4">
           <h2 className="text-2xl font-black uppercase tracking-widest text-white/40">Latest Updates</h2>
           <div className="h-px flex-1 bg-white/5" />
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {gridNews.map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {gridNews.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
             <div className="text-white/20 text-6xl font-black mb-4 tracking-tighter">EMPTY_FEED</div>
             <p className="text-white/40 font-medium">Hiện không có bản tin nào thuộc danh mục này.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
