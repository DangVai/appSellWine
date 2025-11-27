/**
 * Product.d.ts
 * Định nghĩa kiểu dữ liệu cho đối tượng Sản phẩm (Product)
 */

// Kiểu dữ liệu mô tả Sản phẩm sử dụng trong app
export interface Product {
    id: number;
    // canonical fields used in parts of the app
    name?: string;
    img?: string | null;
    // legacy/alternate fields that some components still use
    title?: string;
    image?: string;
    price: number;
    description?: string;
    categoryId?: number;
}
