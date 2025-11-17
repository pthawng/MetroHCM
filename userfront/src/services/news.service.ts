export type NewsCategory = 
  | "System Updates" 
  | "Service Alerts" 
  | "Promotions" 
  | "City & Development" 
  | "Travel Guide";

export type NewsType = "alert" | "update" | "promo";

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  type: NewsType;
  priority: number; // 1: Highest, 5: Lowest
  isFeatured: boolean;
  date: string;
  imageUrl: string;
  author: string;
  statusBadge?: string;
}

const MOCK_NEWS: News[] = [
  {
    id: "news-01",
    title: "Thông báo bảo trì: Thay đổi sảnh chờ nhà ga Bến Thành",
    excerpt: "Nhằm nâng cấp hệ thống kiểm soát vé tự động, khu vực sảnh chờ phía Tây ga Bến Thành sẽ tạm đóng cửa từ 22:00 hôm nay.",
    content: "Chi tiết: Việc nâng cấp hệ thống cổng soát vé tự động giai đoạn 2 sẽ được triển khai khẩn trương để chuẩn bị cho đợt cao điểm du lịch. Hành khách vui lòng di chuyển theo lối đi phụ tại cổng số 3. MetroHCM chân thành xin lỗi vì sự bất tiện này.",
    category: "Service Alerts",
    type: "alert",
    priority: 1,
    isFeatured: false,
    date: "2024-04-01T09:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
    author: "Ban Quản lý MAUR",
    statusBadge: "IMPORTANT"
  },
  {
    id: "news-02",
    title: "Vận hành thử nghiệm toàn tuyến: Metro Số 1 đạt mốc 100% mục tiêu",
    excerpt: "Tất cả 14 đoàn tàu đã hoàn thành đợt chạy thử nghiệm 48 giờ liên tục mà không phát sinh lỗi kỹ thuật nghiêm trọng.",
    content: "Đợt thử nghiệm cuối cùng của Tuyến Metro số 1 (Bến Thành - Suối Tiên) đã diễn ra thành công rực rỡ. Các hệ thống điều khiển đoàn tàu (CBTC), hệ thống điện lưới và thông tin tín hiệu đều vận hành ổn định ở tốc độ tối đa 110km/h.",
    category: "System Updates",
    type: "update",
    priority: 2,
    isFeatured: true,
    date: "2024-03-31T08:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=2000",
    author: "Phòng Kỹ thuật MetroHCM",
    statusBadge: "SYSTEM_READY"
  },
  {
    id: "news-03",
    title: "Trải nghiệm không giới hạn với Thẻ 3 Ngày - Chỉ 90.000đ",
    excerpt: "Đăng ký ngay gói vé 3 ngày để khám phá TP. Hồ Chí Minh hiện đại từ một góc nhìn hoàn toàn mới trên cao.",
    content: "MetroHCM chính thức mở bán gói vé 3 ngày không giới hạn lượt đi. Đây là giải pháp hoàn hảo cho du khách và những ai muốn trải nghiệm toàn bộ tiện ích của Metro Số 1 một cách tiết kiệm nhất.",
    category: "Promotions",
    type: "promo",
    priority: 3,
    isFeatured: false,
    date: "2024-03-30T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000",
    author: "Phòng Kinh doanh",
    statusBadge: "ACTIVE_OFFER"
  },
  {
    id: "news-04",
    title: "Quy hoạch không gian ngầm quanh khu vực ga Ba Son",
    excerpt: "Cùng nhìn lại phương án thiết kế khu thương mại ngầm liên kết trực tiếp với nhà ga hiện đại nhất tuyến số 1.",
    content: "Khu vực ga Ba Son sẽ không chỉ là một trạm dừng mà còn là trung tâm thương mại ngầm sầm uất, kết nối trực tiếp với các tòa nhà văn phòng và khu căn hộ cao cấp ven sông Sài Gòn.",
    category: "City & Development",
    type: "update",
    priority: 4,
    isFeatured: false,
    date: "2024-03-29T14:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
    author: "Sở Quy hoạch Kiến trúc",
    statusBadge: "VISION_2030"
  },
  {
    id: "news-05",
    title: "Cẩm nang du lịch: 5 điểm check-in không thể bỏ qua dọc tuyến Metro",
    excerpt: "Từ chợ Bến Thành truyền thống đến khu du lịch Suối Tiên đầy màu sắc, Metro Số 1 đưa bạn đi qua những biểu tượng của Saigon.",
    content: "Hãy cùng chúng tôi khám phá hành trình du lịch bằng tàu điện với các điểm dừng chân lý tưởng như Nhà hát Thành phố, Công viên Văn Thánh và Khu du lịch Văn hóa Suối Tiên.",
    category: "Travel Guide",
    type: "promo",
    priority: 5,
    isFeatured: false,
    date: "2024-03-28T09:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000",
    author: "Cẩm nang Metro",
    statusBadge: "TRAVEL_TIPS"
  }
];

export const newsService = {
  getNews: (): Promise<News[]> => {
    return Promise.resolve(MOCK_NEWS.sort((a, b) => {
        // Sort by priority first (lower value = higher priority), then by date
        if (a.priority !== b.priority) return a.priority - b.priority;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }));
  },

  getFeaturedNews: async (): Promise<News | undefined> => {
    const all = await newsService.getNews();
    return all.find(n => n.isFeatured) || all[0];
  },

  getAlerts: async (): Promise<News[]> => {
    const all = await newsService.getNews();
    return all.filter(n => n.type === "alert");
  },

  getNewsById: (id: string): Promise<News | undefined> => {
    return Promise.resolve(MOCK_NEWS.find(n => n.id === id));
  }
};
