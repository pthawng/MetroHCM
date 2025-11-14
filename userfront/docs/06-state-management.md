# 06 State Management

Dự án phân tách rõ rệt giữa dữ liệu từ máy chủ (Server State) và trạng thái ứng dụng tại máy khách (Client State).

## 🔹 Server State
Quản lý các dữ liệu được đồng bộ từ Backend:
- **Stations**: Danh sách các nhà ga.
- **Routes**: Thông tin các tuyến đường.
- **Prices**: Bảng giá vé.

👉 **Công nghệ**: Sử dụng **[React Query](https://tanstack.com/query/latest)** để quản lý việc fetch, cache và sync dữ liệu tự động.

## 🔹 Client State
Quản lý các trạng thái tạm thời trong quá trình người dùng tương tác:
- **Selected Stations**: Ga đi và ga đến đang chọn.
- **Booking Info**: Thông tin đặt vé tạm thời (số lượng, loại vé).

👉 **Công nghệ**: Sử dụng **[Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)** để quản lý state tập trung, gọn nhẹ và hiệu năng cao.
