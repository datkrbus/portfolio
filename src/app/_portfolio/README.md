# Trang portfolio (đang ẩn)

Trang chủ portfolio tạm ẩn; site hiện chỉ mở `/todo` và `/tarot`.

Để bật lại:

1. Chuyển `PortfolioHome.tsx` về `src/app/page.tsx` (đổi import `../portfolio-fonts.css` thành `./portfolio-fonts.css`).
2. Chuyển `public/CV.pdf` và `public/avatar.jpg` về thư mục `public/` ở gốc dự án.
3. Đưa `portfolioMetadata` và `portfolioJsonLd` trong `seo.ts` về lại `src/app/layout.tsx` (metadata + thẻ `<script type="application/ld+json">`).
