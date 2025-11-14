# 07 Performance

Đảm bảo ứng dụng hoạt động mượt mà ngay cả trên các thiết bị cấu hình thấp và mạng không ổn định.

## 🚀 Strategy (Chiến lược tối ưu)

- **Lazy Load Map**: Chỉ tải thư viện bản đồ khi người dùng mở trang tra cứu tuyến hoặc bản đồ ga.
- **Cache API**: Tận dụng cơ chế caching của React Query để hạn chế các yêu cầu mạng không cần thiết cho dữ liệu tĩnh (danh sách ga).
- **Debounce Search**: Áp dụng kỹ thuật debounce cho thanh tìm kiếm tên ga để tránh gửi quá nhiều yêu cầu API khi người dùng đang nhập.

## 📉 Metrics (Chỉ số mục tiêu)

- **First Load**: < 2 giây cho lần tải trang đầu tiên.
- **Booking Flow**: Hoàn thành quy trình đặt vé (từ Home đến QR) trong vòng < 5 giây.
