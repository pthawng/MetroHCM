# 10 Deployment

Quy trình triển khai tự động giúp rút ngắn thời gian đưa sản phẩm tới người dùng.

## 🌍 Environments (Các môi trường)

- **Dev**: Môi trường phát triển cục bộ và máy chủ kiểm thử nội bộ.
- **Staging**: Bản sao chính xác của Production để kiểm chứng lần cuối trước khi ra mắt.
- **Production**: Môi trường thực tế phục vụ khách hàng.

## 🔄 CI/CD Pipeline

Mọi lượt thay đổi mã nguồn (pull request/merge) đều phải đi qua các bước tự động:

1. **Lint**: Kiểm tra lỗi cú pháp và định dạng mã nguồn (ESLint).
2. **Test**: Chạy bộ kiểm thử tự động (Unit & Integration tests).
3. **Build**: Biên dịch mã nguồn sang bản phân phối tối ưu.
4. **Deploy**: Tự động đẩy bản build lên máy chủ lưu trữ (Vercel/Netlify/Docker).
