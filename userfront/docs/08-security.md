# 08 Security

Các biện pháp bảo mật cốt lõi để bảo vệ dữ liệu người dùng và hệ thống.

## 🔒 Các lớp bảo vệ

- **Validate Input (Zod)**: Sử dụng thư viện **Zod** để kiểm tra và làm sạch dữ liệu đầu vào (phía client và server) nhằm ngăn chặn tấn công injection.
- **Auth Token**: Mọi yêu cầu nhạy cảm đều yêu cầu JSON Web Token (JWT) hợp lệ trong header.
- **HTTPS Only**: Chỉ cho phép truy cập qua giao thức bảo mật HTTPS để mã hóa dữ liệu truyền tải.
- **Rate Limit**: Áp dụng cơ chế giới hạn số lượng yêu cầu từ một IP trong một khoảng thời gian nhất định để chống tấn công brute-force và DoS.
