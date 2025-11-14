# 03 UX/UI Guideline

## 🎯 Design principles

- **Mobile-first**: Ưu tiên trải nghiệm người dùng trên thiết bị di động, đảm bảo giao diện gọn gàng và tốc độ phản hồi nhanh.
- **1-handed usage**: Bố trí các nút bấm quan trọng trong tầm với của ngón cái để người dùng dễ dàng thao tác bằng một tay khi đang di chuyển.
- **≤ 3 steps để mua vé**: Tối ưu hóa quy trình đặt vé sao cho người dùng có thể nhận được vé chỉ trong tối đa 3 bước thao tác chính.

## 🎨 Color system

Hệ thống màu sắc chủ đạo mang tính tin cậy và thân thiện:

| Loại màu | Mã màu (HEX) | Ý nghĩa |
| :--- | :--- | :--- |
| **Primary** | `#007AFF` | Màu xanh dương đại diện cho sự tin cậy, an toàn và hiện đại. |
| **Secondary** | `#22C55E` | Màu xanh lá biểu trưng cho sự thông suốt, lệnh thành công và thân thiện môi trường. |

## 🧩 Component system (Atomic Design)

Chúng ta áp dụng triết lý Atomic Design để xây dựng hệ thống UI có khả năng tái sử dụng cao:

### 1. Atoms (Nguyên tử)
Các thành phần UI nhỏ nhất, không thể chia nhỏ thêm:
- **Button**: Nút bấm với các trạng thái (primary, secondary, disabled).
- **Input**: Trường nhập văn bản, chọn ngày tháng.
- **Icon**: Các biểu tượng hướng dẫn (ga tàu, lịch sử, bản đồ).

### 2. Molecules (Phân tử)
Nhóm các nguyên tử kết hợp lại để thực hiện một chức năng đơn giản:
- **StationSelect**: Kết hợp Input và danh sách gợi ý để người dùng chọn mã ga.
- **PriceDisplay**: Hiển thị số tiền kèm ký hiệu tiền tệ tương ứng.

### 3. Organisms (Sinh vật)
Các khối giao diện phức tạp hơn, có thể hoạt động độc lập:
- **BookingForm**: Bao gồm việc chọn ga đi/đến, chọn số lượng vé và nút xác nhận.
- **TicketCard**: Hiển thị thông tin vé kèm mã QR và trạng thái vé.
