# Commerce Backend

Hệ thống Backend cho ứng dụng Thương mại điện tử (E-commerce) được xây dựng dựa trên kiến trúc Modular với NestJS, tối ưu hóa cho hiệu suất và khả năng mở rộng thông qua MongoDB Atlas.

## 🚀 Công Nghệ Sử Dụng (Tech Stack)
- **Framework Core:** [NestJS](https://nestjs.com/) (Node.js)
- **Cơ sở dữ liệu:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) thông qua [Mongoose](https://mongoosejs.com/)
- **Caching & Queue (Mở rộng):** Redis / BullMQ
- **Lưu trữ Media:** AWS S3 / Cloudinary
- **Ngôn ngữ triển khai:** TypeScript

## 📂 Kiến Trúc Cơ Sở Dữ Liệu (Schema Design)
Thiết kế tập trung vào hướng "Read-heavy" và nguyên tắc dữ liệu nhất quán (ACID properties) sử dụng MongoDB Transactions cho các luồng quan trọng.

### Các Collections Chính
- **Users**: Lưu trữ thông tin người dùng, bảo mật mật khẩu (bcrypt), phân quyền (Role-based) và danh sách địa chỉ.
- **Categories**: Danh mục sản phẩm (có hỗ trợ danh mục con đa cấp - nested categories).
- **Products**: Thông tin sản phẩm, giá gốc/giá giảm, số lượng tồn kho (stock), hình ảnh, và các biến thể (attributes).
- **Carts**: Quản lý phiên giỏ hàng của từng người dùng.
- **Orders**: Quản lý lịch sử và trạng thái đơn hàng. Tách biệt thông tin snapshot của sản phẩm khi mua để tránh thay đổi lịch sử.
- **Reviews**: Lịch sử đánh giá, bình luận của khách hàng về sản phẩm.

## 📦 Phân Chia Tính Năng (Modules)
- `AuthModule`: Xác thực người dùng, JWT Tokens, Guards bảo vệ Route.
- `UserModule`: Quản lý tài khoản, profile và các thao tác CRUD cơ bản.
- `ProductModule` & `CategoryModule`: Quản lý danh mục hàng hóa, tìm kiếm (Full-text search), lọc kết quả và phân trang.
- `CartModule`: Quản lý logic thêm/bớt/xóa sản phẩm khỏi giỏ hàng.
- `OrderModule`: Xử lý thanh toán và chốt đơn, đóng vai trò đảm bảo giao dịch nguyên vẹn khi vừa tạo đơn vừa tính toán bớt lượng tồn kho của sản phẩm (MongoDB Transactions).

## 🗺 Lộ Trình Triển Khai (Roadmap)
- **Giai đoạn 1 (Foundation & Auth):** Khởi tạo source code, config môi trường, kết nối DB và hoàn thiện Auth (Đăng nhập/Đăng ký).
- **Giai đoạn 2 (Catalog Management):** API quản lý hiển thị, thêm, sửa, xoá Danh mục và Sản phẩm.
- **Giai đoạn 3 (Cart & Checkout):** API quản lý Giỏ hàng và luồng đặt hàng (Checkout).
- **Giai đoạn 4 (Payment & Optimization):** Tích hợp thanh toán online, Redis Caching, và tạo tài liệu API với Swagger.

## ⚙️ Hướng Dẫn Cài Đặt (Getting Started)
*(Block này sẽ được cập nhật chi tiết sau khi dự án có các file thực tế)*

```bash
# Clone kho lưu trữ
git clone https://github.com/n1ml3/commerce-backend.git
cd commerce-backend

# Cài đặt dependencies
npm install

# Copy và Setup biến môi trường
cp .env.example .env

# Chạy server ở chế độ Development
npm run start:dev
```
