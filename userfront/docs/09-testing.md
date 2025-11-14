# 09 Testing

Hệ thống kiểm thử đảm bảo độ ổn định của ứng dụng qua từng phiên bản.

## 🎯 Testing Levels

- **Unit**: Kiểm thử các custom hooks, hàm xử lý logic đặt vé và các thành phần UI nhỏ lẻ.
- **Integration**: Kiểm thử quy trình đặt vé (`booking flow`) - sự phối hợp giữa chọn ga, tính giá và chuyển giao diện.
- **E2E (End-to-End)**: Kiểm thử toàn bộ quy trình người dùng từ lúc mở app đến khi nhận được vé QR thành công trên môi trường thật.

## 🛠 Tools (Công cụ sử dụng)

- **[Jest](https://jestjs.io/)**: Chạy Unit tests và logic.
- **[Playwright](https://playwright.dev/)**: Thực hiện kiểm thử UI và E2E tự động trên nhiều trình duyệt khác nhau.
