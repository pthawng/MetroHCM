import { FareMatrixTable } from '@/components/features/fare/FareMatrixTable';
import { Train, Info, CreditCard, Ticket } from 'lucide-react';

export const metadata = {
  title: 'Giá vé Metro Số 1 - MetroHCM Command Center',
  description: 'Bảng giá vé chính thức tuyến Metro Bến Thành - Suối Tiên. Cập nhật tháng 12/2024.',
};

export default function FarePage() {
  return (
    <main className="min-h-screen py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-4 animate-pulse">
          <Train size={16} /> Official Fare System
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase italic">
          BIỂU GIÁ VÉ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">METRO SỐ 1</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-white/40 font-medium">
          Thông tin chi tiết các loại vé và bảng giá niêm yết theo Quyết định số 5327/QĐ-UBND ngày 21/11/2024. 
          Đảm bảo tính cung cấp dữ liệu chính xác cho người dân.
        </p>
      </section>

      {/* Fare Policy Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                <Ticket size={24} />
            </div>
            <h3 className="text-xl font-bold">Vé Lượt (Token)</h3>
            <p className="text-white/40 text-sm leading-relaxed">
                Áp dụng cho hành khách đi một lượt đơn lẻ. Thanh toán bằng tiền mặt tại các máy bán vé tự động (TVM) hoặc quầy vé. 
                Giá từ 7.000đ - 20.000đ.
            </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                <CreditCard size={24} />
            </div>
            <h3 className="text-xl font-bold">Vé Ngày (Unlimited)</h3>
            <p className="text-white/40 text-sm leading-relaxed">
                Di chuyển không giới hạn trong ngày. 
                <br/>• Vé 1 ngày: <span className="text-emerald-400 font-bold">40.000đ</span>
                <br/>• Vé 3 ngày: <span className="text-emerald-400 font-bold">90.000đ</span>
            </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                <Info size={24} />
            </div>
            <h3 className="text-xl font-bold">Đối tượng ưu tiên</h3>
            <p className="text-white/40 text-sm leading-relaxed">
                Miễn phí vé cho trẻ em dưới 6 tuổi (đi cùng người lớn), người khuyết tật trọng yếu, 
                người cao tuổi và người có công với cách mạng theo quy định hiện hành.
            </p>
        </div>
      </section>

      {/* Full Matrix Table */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Chi tiết Ma trận Toàn tuyến</h2>
            <div className="h-px flex-1 bg-white/10" />
        </div>
        <FareMatrixTable />
      </section>
    </main>
  );
}
