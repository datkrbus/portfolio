# Todo app: UI/UX và bản frontend local

App tại `/todo/` giữ phạm vi quản lý công việc, danh mục, lịch, lặp lại, lời nhắc, thống kê, tài khoản local và sao lưu/khôi phục. Giao diện dùng xanh dương đậm (navy/royal blue), theme sáng/tối/theo hệ thống và font hệ thống. Có ngôn ngữ tiếng Việt/English cho điều hướng, form, lịch, nhãn, thông báo và lỗi.

## Chạy trên máy cá nhân

Yêu cầu Node.js 22.13 trở lên trong nhánh 22, hoặc Node.js 24 trở lên.

```sh
npm ci
npm run build
npm start
```

Mở **http://localhost:3000/todo/**. `npm run build` xuất HTML/CSS/JS vào `out/` theo [static export của Next.js](https://nextjs.org/docs/app/guides/static-exports). `npm start` chỉ phục vụ file tĩnh và bind vào loopback 127.0.0.1. Không có API lưu dữ liệu, database, đăng nhập server hay đồng bộ cloud. Có thể dùng một static server khác để phục vụ `out/`.

Khi phát triển, dùng `npm run dev`. Sau khi sửa mã nguồn, build lại để cập nhật bản được phục vụ bởi `npm start`.

Dữ liệu nằm trong localStorage của từng trình duyệt theo origin. Dùng cùng `http://localhost:3000` để giữ cùng không gian dữ liệu; đổi trình duyệt, hostname hoặc port sẽ dùng vùng lưu khác. Sao lưu JSON giúp chuyển dữ liệu giữa máy. File/font của màn todo được phục vụ local; font Google của trang portfolio đã tách khỏi CSS dùng chung.

## Những luồng đã cải tiến

- Chọn Việt/Anh ở màn đăng nhập, thanh trên hoặc cài đặt. Chuyển ngay, cập nhật ngày/thứ/tháng, ngôn ngữ tài liệu và tiêu đề tab; nhớ bằng key local riêng của trình duyệt và nhận thay đổi từ tab khác. Tên việc, ghi chú và danh mục đã lưu không bị dịch hay sửa. Lựa chọn ngôn ngữ thuộc trình duyệt, không nằm trong backup tài khoản.
- Điều hướng bên trái trên desktop, thanh dưới trên điện thoại; các màn hình phụ và danh mục vẫn dễ truy cập.
- Thêm nhanh với ngày hôm nay/ngày mai rõ ràng; form đầy đủ mặc định công việc cả ngày. Giờ cụ thể, việc con, hạn chót, lặp lại, lời nhắc và nhãn chỉ mở khi cần. Việc con đang nhập được giữ khi lưu; đóng bản nháp có thay đổi sẽ hỏi giữ hay bỏ.
- Bảng bốn trạng thái và danh sách dùng chung tìm kiếm, lọc và sắp xếp. Có nút hoàn thành và chọn trạng thái để thao tác khi không kéo thả. Nhóm theo ngày vẫn theo thứ tự thời gian.
- Lịch tháng/tuần/ngày/lịch trình có thanh điều hướng chung, chọn nhanh ngày, thêm tại ngày/khung giờ. Lịch hai chiều cuộn trong vùng riêng trên màn nhỏ.
- Trạng thái trống có hành động tiếp theo; trạng thái không tìm thấy cho phép bỏ lọc. Thông báo xóa có hoàn tác cho đến khi đóng hoặc xóa việc khác.
- Quản lý danh mục có kiểm tra tên trùng và xác nhận xóa; công việc trong danh mục được giữ. Khôi phục JSON kiểm tra dữ liệu và hiển thị số công việc/danh mục trước khi thay thế. Xóa dữ liệu cần xác nhận riêng và có lựa chọn sao lưu.
- Native dialog, nhãn cho input/nút biểu tượng, focus hiển thị, skip link, thông báo trạng thái và hỗ trợ giảm chuyển động. Menu đóng bằng Escape; có phím Ctrl/Cmd+K để tìm và Ctrl/Cmd+Enter để lưu form.

## Tiêu chí và kiểm tra

Dùng [WCAG 2.2](https://www.w3.org/TR/WCAG22/) làm mục tiêu accessibility và [Core Web Vitals](https://web.dev/articles/vitals) làm tiêu chí đo hiệu năng. Đây là mục tiêu đánh giá, không phải chứng nhận đạt chuẩn hay tuyên bố app tốt nhất.

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm audit --audit-level=high
npm run build
```

Đã kiểm tra ngày **2026-10-09**:

- 26 bài regression chạy qua ở Asia/Ho_Chi_Minh, America/Los_Angeles và Pacific/Auckland: 78 lượt. Bao gồm ngày/giờ, lịch, lặp lại, lọc/sắp xếp, nhập dữ liệu, cô lập tài khoản, xung đột tab, lỗi lưu, ngày tháng English và nội suy bản dịch giữ nguyên nội dung người dùng.
- 19 bài kiểm tra DOM qua: thêm nhanh, form đơn giản, giữ việc con đang nhập, bản nháp, giờ không hợp lệ, xác nhận xóa, xem trước backup, file lỗi, hoàn thành/sửa không kéo thả, điều hướng mobile và danh mục. Kiểm tra thêm đổi ngôn ngữ/lưu lựa chọn/mở lại, lỗi dịch tức thì, lịch/bảng English, dữ liệu không bị dịch, đồng bộ lựa chọn giữa tab và độ đầy đủ của từ điển. Các bài này dùng jsdom, không thay thế trình duyệt thật.
- TypeScript, ESLint, Prettier, build tĩnh qua; audit toàn bộ dependency báo 0 lỗ hổng tại thời điểm kiểm tra. HTTP của màn todo và file JS/CSS được kiểm tra khi chạy static server.
- GitHub Actions đã được cấu hình chạy các kiểm tra trên; chưa chạy workflow trên GitHub trong phiên local này.

Môi trường không có trình duyệt kết nối với công cụ UI. Chưa kiểm tra hình ảnh thực tế, kéo thả/touch, focus trap của trình duyệt, screen reader, contrast/zoom hoặc đo Lighthouse. Không có điểm WCAG hay Web Vitals được suy ra từ lint/DOM tests. Khi có trình duyệt, cần kiểm tra 320px, 390px, desktop, zoom 200%, hai theme, keyboard, reload, import/export và xung đột hai tab bằng dữ liệu thử.

## Dữ liệu và giới hạn

- Key lưu dữ liệu/session hiện tại được giữ để tương thích. Backup cũ chưa có version vẫn được chấp nhận; backup mới có version 1. Import remap ID và tài khoản, khôi phục cài đặt, kiểm tra bản ghi lồng nhau trước khi thay thế.
- Dữ liệu hỏng không bị ghi đè âm thầm. Lỗi lưu hiển thị lựa chọn xuất backup/tải lại. Snapshot phát hiện ghi đè từ tab cũ; localStorage không có compare-and-swap theo transaction và không tự hợp nhất thay đổi đồng thời.
- Tài khoản là cơ chế local hiện có. Mật khẩu và công việc lưu trong trình duyệt, không được mã hóa. Đăng xuất giữ dữ liệu; xóa dữ liệu công việc giữ tài khoản/cài đặt.
- Lời nhắc cần app đang mở và quyền thông báo; không chạy nền khi đóng app.
- Công việc có giờ kết thúc trong cùng ngày; giờ cuối giới hạn 23:59. Lặp tháng/năm về ngày hợp lệ cuối tháng nếu cần và các lần sau dùng ngày kết quả. Hoàn thành một việc lặp chỉ tạo một lần kế tiếp, kể cả khi mở lại việc đã hoàn thành.
