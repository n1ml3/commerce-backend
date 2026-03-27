# Backend Thương Mại Điện Tử

Đây là dịch vụ backend cho nền tảng thương mại điện tử đa người bán, được xây dựng bằng **NestJS** và **MongoDB**.

## Tính năng

- **Xác thực & Ủy quyền**: Xác thực dựa trên JWT với kiểm soát truy cập dựa trên vai trò (Admin, Vendor, User).
- **Người dùng**: Quản lý hồ sơ người dùng và phân quyền.
- **Gian hàng (Vendors)**: Hồ sơ cửa hàng, mô tả cửa hàng và quản lý sản phẩm dành riêng cho từng gian hàng.
- **Sản phẩm**: Đầy đủ các thao tác CRUD (Tạo, Đọc, Cập nhật, Xóa) cho sản phẩm, được gắn với gian hàng và danh mục. Hỗ trợ chức năng thích/bỏ thích sản phẩm.
- **Danh mục**: Tổ chức sản phẩm theo danh mục có phân cấp.
- **Giỏ hàng**: Quản lý giỏ hàng riêng biệt cho từng người dùng.
- **Đơn hàng**: Thanh toán an toàn và quản lý đơn hàng với theo dõi trạng thái (Chờ duyệt, Đang xử lý, Đang giao, Đã giao, Đã hủy).
- **Đánh giá & Xếp hạng**: Khách hàng có thể đánh giá sản phẩm bằng xếp hạng sao và bình luận.

## Công nghệ sử dụng

- **Khung ứng dụng (Framework)**: [NestJS](https://nestjs.com/)
- **Cơ sở dữ liệu**: MongoDB & Mongoose
- **Bảo mật**: bcrypt (mã hóa mật khẩu), @nestjs/jwt (quản lý token)

## Chạy ứng dụng

Hãy chắc chắn rằng bạn đã chạy MongoDB trước khi khởi động ứng dụng. Cập nhật tệp `.env` (hoặc cấu hình các biến môi trường) nếu URL kết nối MongoDB của bạn khác.

```bash
# Cài đặt các thư viện cần thiết
npm install

# Chạy ứng dụng trong môi trường phát triển (development)
npm run start:dev

# Chạy ứng dụng trong môi trường sản xuất (production)
npm run build
npm run start:prod
```

## Tổng quan về API

API được xây dựng dựa trên các nguyên tắc RESTful. Hầu hết các endpoint yêu cầu xác thực đều sử dụng token Bearer qua header `Authorization`.

- `/auth`: Các endpoint đăng nhập và đăng ký.
- `/users`: Lấy thông tin, cập nhật và quản lý người dùng. Admin có thể xem/xóa tất cả người dùng.
- `/products`: Lấy danh sách sản phẩm, tạo sản phẩm (Vendor/Admin) và quản lý kho.
- `/carts`: Xem và chỉnh sửa giỏ hàng của người dùng hiện tại (bao gồm thêm, sửa, xóa).
- `/orders`: Đặt hàng (checkout) và quản lý trạng thái các đơn hàng.
- `/reviews`: Tạo và xem các đánh giá sản phẩm.
- `/categories`: Xem danh sách danh mục các mặt hàng.
