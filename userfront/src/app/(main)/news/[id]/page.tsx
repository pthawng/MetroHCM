'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { newsService, News } from '@/services/news.service';
import { Container } from '@/components/layout/LayoutHelpers';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Clock, 
  ChevronRight,
  Zap,
  ShieldAlert,
  Ticket
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [suggestion, setSuggestion] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (typeof id === 'string') {
        const data = await newsService.getNewsById(id);
        const all = await newsService.getNews();
        setNews(data || null);
        setSuggestion(all.filter(n => n.id !== id).slice(0, 2));
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen pt-40 animate-pulse bg-white/5" />;
  }

  if (!news) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl font-black text-white/20">404_NOT_FOUND</h1>
        <Link href="/news" className="text-primary font-bold uppercase tracking-widest flex items-center gap-2">
           <ArrowLeft size={16} /> Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  const isAlert = news.type === 'alert';
  const isUpdate = news.type === 'update';

  return (
    <main className="min-h-screen bg-[#06080F] pt-32 pb-40 relative">
      
      {/* 1. Cinematic Header Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden -z-10">
         <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover opacity-20 blur-xl" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#06080F]" />
      </div>

      <Container>
        {/* 2. Navigation Breadcrumb */}
        <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-12">
           <Link href="/news" className="hover:text-white transition-colors">Tin tức</Link>
           <ChevronRight size={12} />
           <span className="text-white/60">{news.category}</span>
        </nav>

        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-20">
           
           {/* Left Article */}
           <article className="space-y-12">
              <div className="space-y-6">
                 {/* Type Badge */}
                 <div className={cn(
                    "w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                    isAlert ? "bg-red-500/20 border-red-500/40 text-red-500" :
                    isUpdate ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" :
                    "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                 )}>
                    {isAlert ? <ShieldAlert size={14} /> : isUpdate ? <Zap size={14} /> : <Ticket size={14} />}
                    {news.category}
                 </div>

                 <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] uppercase tracking-tighter italic">
                    {news.title}
                 </h1>

                 {/* Meta Row */}
                 <div className="flex flex-wrap items-center gap-8 py-6 border-y border-white/5 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2"><User size={14} /> By {news.author}</div>
                    <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(news.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><Clock size={14} /> 4 Min Read</div>
                    <button className="flex items-center gap-2 ml-auto text-primary hover:text-white transition-colors">
                       <Share2 size={16} /> Share_Story
                    </button>
                 </div>
              </div>

              {/* Main Image */}
              <div className="aspect-[21/9] rounded-[40px] overflow-hidden border border-white/10 shadow-3xl">
                 <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
              </div>

              {/* Article Body */}
              <div className="prose prose-invert prose-lg max-w-none space-y-8 font-medium text-slate-400 leading-relaxed">
                 <p className="text-2xl text-white font-bold italic border-l-4 border-primary pl-8">
                    {news.excerpt}
                 </p>
                 <div dangerouslySetInnerHTML={{ __html: news.content }} />
                 {/* Dummy content for aesthetic length */}
                 <p>
                    Hệ thống Metro Số 1 đang bước vào giai đoạn vận hành quyết định, đánh dấu bước ngoặt lớn trong hạ tầng giao thông đô thị của thành phố Hồ Chí Minh. Việc số hóa toàn bộ trải nghiệm hành khách thông qua MetroHCM giúp đảm bảo tính đồng bộ, minh bạch và tiện lợi tối đa.
                 </p>
                 <p>
                    Chúng tôi cam kết mang lại một hành trình xanh, hiện đại và đẳng cấp cho cư dân thành phố. Mọi thắc mắc vui lòng liên hệ tổng đài hỗ trợ 24/7 của MAUR.
                 </p>
              </div>
           </article>

           {/* Right Sidebar */}
           <aside className="space-y-12">
              <div className="glass-panel p-8 rounded-[32px] space-y-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Tin tức liên quan</h3>
                 <div className="space-y-8">
                    {suggestion.map(n => (
                       <Link key={n.id} href={`/news/${n.id}`} className="block group">
                          <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                             <img src={n.imageUrl} alt={n.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                             {n.title}
                          </h4>
                       </Link>
                    ))}
                 </div>
              </div>

              <div className="glass-panel p-8 rounded-[32px] bg-primary/10 border-primary/20 space-y-4">
                 <h3 className="text-xl font-black text-white italic">METRO BULLETIN</h3>
                 <p className="text-xs text-white/40 leading-relaxed font-medium">
                    Đăng ký nhận bản tin vận hành sớm nhất qua Email để không bỏ lỡ thông tin quan trọng.
                 </p>
                 <button className="w-full py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all">
                    Đăng ký ngay
                 </button>
              </div>
           </aside>

        </div>
      </Container>

    </main>
  );
}
