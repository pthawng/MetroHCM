# Hướng Dẫn Hệ Thống Database Seeding (MetroHCM)

Hệ thống Seeding của MetroHCM được thiết kế theo chuẩn kỹ thuật cực cao của các tập đoàn công nghệ lớn (L8/L9 Standard). Mục tiêu không chỉ là "bơm" dữ liệu ảo để test, mà là tạo ra một **Hạ tầng Dữ liệu Vận tải (Transit Data Infrastructure)** mạnh mẽ, nhất quán và sẵn sàng cho môi trường Production.

---

## 🚀 1. Lệnh Thực Thi (Commands)

Để chạy seed dữ liệu, hãy mở terminal tại thư mục `backend` và sử dụng 1 trong 2 lệnh sau:

### Chế độ 1: Upsert (Khuyên dùng cho Staging / Production)
```bash
npx prisma db seed -- --mode=upsert
```
- **Hoạt động**: Cập nhật dữ liệu cũ và chèn thêm dữ liệu mới.
- **Tính năng đặc biệt (Ghost Mitigation)**: Nếu bạn xóa một nhà ga trong file code, hệ thống sẽ tự động tìm nhà ga đó trong Database và đổi `status` thành `'closed'` (Soft Delete). Tuyệt đối không xóa cứng (Hard Delete) để bảo vệ lịch sử giao dịch.

### Chế độ 2: Reset (Chỉ dùng cho Development)
```bash
npx prisma db seed -- --mode=reset
```
- **Hoạt động**: Xóa trắng toàn bộ dữ liệu hiện có trong Database (Route, Segment, Station, Fare, Line) và nạp lại từ con số 0.
- **Cảnh báo**: Tuyệt đối không chạy lệnh này trên Production.

---

## 🏗️ 2. Kiến Trúc Hệ Thống (Architecture)

Hệ thống được chia làm 3 thành phần chính để đảm bảo tính dễ mở rộng (Decoupling):

1. **`types.ts` (Khuông Đúc)**: Chứa interface `ITransitLine`. Bất kỳ tuyến tàu nào muốn nạp vào hệ thống đều bắt buộc phải tuân thủ chuẩn dữ liệu này. Nó đảm bảo không ai có thể đưa data thiếu hoặc sai kiểu vào DB.
2. **`data/` (Kho Dữ Liệu)**: Thư mục chứa các file định nghĩa dữ liệu (vd: `line-1.data.ts`), giá vé (`fare.data.ts`) và khu trung chuyển (`transfer.data.ts`).
3. **`seed.orchestrator.ts` (Bộ Não)**: Đọc toàn bộ dữ liệu từ `data/index.ts` và thực hiện các câu lệnh SQL mạnh mẽ (gồm Promise.all và Transactions) để đẩy đồng loạt dữ liệu vào Database với tốc độ cực nhanh.

---

## 🛠️ 3. Hướng Dẫn Mở Rộng: Thêm Tuyến Tàu Mới (Ví dụ Tuyến 2)

Hệ thống được thiết kế theo mô hình Registry (Ghi danh). Để thêm một tuyến Metro số 2, bạn không cần phải sửa bất kỳ dòng code logic nào, chỉ cần làm 3 bước sau:

**Bước 1:** Tạo file `line-2.data.ts` trong thư mục `src/database/seeds/data/` với nội dung dựa theo khuôn đúc:
```typescript
import { ITransitLine } from '../types';

export const line2Data: ITransitLine = {
  line: {
    code: 'L2',
    name: 'Tuyến số 2: Bến Thành – Tham Lương',
    color: '#FF0000', // Màu đỏ
    totalLengthKm: 11.3,
    status: 'under_construction',
  },
  stations: [
    // ... Danh sách nhà ga của L2
  ],
  depots: [
    // ... Depot Tham Lương
  ],
  trains: [
    // ... Danh sách các đoàn tàu của L2
  ]
};
```

**Bước 2:** Đăng ký tuyến 2 vào "Bộ não" thông qua Registry `data/index.ts`:
```typescript
import { ITransitLine } from '../types';
import { line1Data } from './line-1.data';
import { line2Data } from './line-2.data'; // <-- Import file mới

export const activeLines: ITransitLine[] = [
  line1Data,
  line2Data, // <-- Thêm vào mảng NÀY
];
```

**Bước 3:** Chạy lệnh Seed:
```bash
npx prisma db seed -- --mode=upsert
```
Boom! L2 đã có mặt trong Database mà không hề móp méo hay ảnh hưởng tới L1.

---

## 💵 4. Hướng Dẫn Thay Đổi Giá Vé (Fares)

Nếu thành phố HCM quyết định thay đổi giá vé Metro, bạn hãy vào file `src/database/seeds/data/fare.data.ts`.

```typescript
  rules: [
    { 
      name: 'Chặng ngắn (< 5km)', 
      minKm: 0, 
      maxKm: 5, 
      price: 15000
    },
    // ...
  ]
```

Sau khi sửa, hãy chạy `npx prisma db seed -- --mode=upsert`. Hệ thống sẽ dựa vào `name` để tự động Cập Nhật (Update) mức giá lên 15k mà không sinh ra dữ liệu rác.

---

## 🛡️ 5. Tại sao hệ thống này đạt chuẩn L8/L9?

- **Atomic Transactions**: Một lỗi nhỏ xảy ra khi đang seed ga tàu thứ 200, toàn bộ 199 ga trước đó sẽ bị gỡ bỏ. Không bao giờ có chuyện Database bị mắc kẹt ở trình trạng "1 nửa chín, 1 nửa sống" (Corrupted Graph).
- **Concurrency (Tối ưu I/O)**: Không lặp Tuần Tự từng dòng chờ Database (`for` > `await` > `Database`). Mà hệ thống bó 100 câu lệnh thành 1 gói Promise bất đồng bộ tung 1 lần, giúp quá trình nạp data Nặng chạy nhanh gấp chục lần.
- **Auto Ghost-Cleanup**: Tính năng "Tự đứt đuôi". Mã code tự động chụp hình Database cũ, nếu thấy Code hiện tại mất tích 1 trạm tàu, nó sẽ gửi lệnh `soft-delete` đóng bến tàu đó lại một cách vô cùng ngăn nắp.
