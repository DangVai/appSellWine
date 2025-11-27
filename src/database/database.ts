import * as SQLite from 'expo-sqlite';
import { Product as ProductModel } from '../features/Products/models/Product'; // Giả định Product model được import đúng

// ===============================================
// 1. INTERFACES (Đã giữ nguyên và tối ưu)
// ===============================================
export interface Product extends ProductModel {
    id: number;
    name: string;
    price: number;
    img: string | null;
    categoryId: number;
}

export interface Category {
    id: number;
    name: string;
    iconUri?: string;
}

export interface User {
    id: number;
    username: string;
    password?: string;
    isAdmin: boolean;
    phone?: string;
    createdAt: string;
}

export interface Order {
    id: number;
    userId: number;
    total: number;
    status: string;
    address: string;
    phone?: string;
    createdAt: string;
}

// OrderWithPhone vẫn giữ nguyên vì Order đã có phone
export interface OrderWithPhone extends Order { }

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}


// ===============================================
// 2. INITIAL DATA & DATABASE INSTANCE
// ===============================================
let db: any = null;

const getDatabase = () => {
    if (!db) {
        db = SQLite.openDatabaseSync('products.db');
    }
    return db;
};

const initialCategories: Category[] = [
    { id: 1, name: 'Château Margaux', iconUri: 'https://royalwine.com.vn/wp-content/uploads/2021/06/Chateau-Margaux-1er-Cru-Classe.jpg' },
    { id: 2, name: 'DRC (Romanée-Conti)', iconUri: 'https://sanhruou.com/media/18238/content/chai-domaine-de-la-romanee-conti-la-tache-1972-duoc-ban-voi-gia-150-000-usd.jpg' },
    { id: 3, name: 'Penfolds Grange', iconUri: 'https://thekeywine.vn/wp-content/uploads/2023/06/Penfolds-Grange-Bin-95-1.jpg' },
    { id: 4, name: 'Antinori Tignanello', iconUri: 'https://winecellar.vn/wp-content/uploads/2022/10/ruou-vang-my-treana-red-1067x800.jpg' },
    { id: 5, name: 'Moët & Chandon', iconUri: 'https://bizweb.dktcdn.net/100/132/269/products/ruou-mo-vay-vang-500ml.jpg?v=1566963485860' },
    { id: 6, name: 'Cloudy Bay', iconUri: 'https://thanhnien.mediacdn.vn/Uploaded/minhnguyet/2016_03_03/ruounho_FLKG.jpg' },
];

const initialProducts: Product[] = [
    { id: 1, name: 'Château Margaux 2018', price: 15000000, img: 'https://royalwine.com.vn/wp-content/uploads/2021/06/Chateau-Margaux-1er-Cru-Classe.jpg', categoryId: 1 },
];


// ===============================================
// 3. DATABASE INITIALIZATION (Đã sửa lỗi cú pháp)
// ===============================================
export const initializeDatabase = async (callback: () => void) => {
    try {
        const db = getDatabase();
        // 1. TẠO CÁC BẢNG NẾU CHƯA TỒN TẠI
        await db.execAsync(`
            PRAGMA foreign_keys = ON;
            
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY NOT NULL,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                isAdmin INTEGER NOT NULL,
                phone TEXT, 
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                iconUri TEXT
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                img TEXT,
                categoryId INTEGER NOT NULL,
                FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY NOT NULL,
                userId INTEGER NOT NULL,
                total REAL NOT NULL,
                status TEXT NOT NULL,
                address TEXT NOT NULL,
                phone TEXT, 
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY NOT NULL,
                orderId INTEGER NOT NULL,
                productId INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY(orderId) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY(productId) REFERENCES products(id) ON DELETE CASCADE
            );
        `);

        // 2. CẬP NHẬT CẤU TRÚC BẢNG (CHỈ THÊM CỘT PHONE NẾU THIẾU)

        // Kiểm tra và thêm cột 'phone' vào bảng orders
        const ordersTableInfo = await db.getAllAsync('PRAGMA table_info(orders);');
        const ordersColumns = ordersTableInfo.map((row: any) => row.name);
        if (!ordersColumns.includes('phone')) {
            await db.execAsync(`
              ALTER TABLE orders ADD COLUMN phone TEXT;
            `);
        }

        // Kiểm tra và thêm cột 'phone' vào bảng users
        const usersTableInfo = await db.getAllAsync('PRAGMA table_info(users);');
        const usersColumns = usersTableInfo.map((row: any) => row.name);
        if (!usersColumns.includes('phone')) {
            await db.execAsync(`
              ALTER TABLE users ADD COLUMN phone TEXT;
            `);
        }

        // Kiểm tra và thêm cột 'createdAt' vào bảng users
        if (!usersColumns.includes('createdAt')) {
            await db.execAsync(`
              ALTER TABLE users ADD COLUMN createdAt DATETIME;
            `);
            // Cập nhật các hàng cũ với giá trị hiện tại
            await db.execAsync(`
              UPDATE users SET createdAt = CURRENT_TIMESTAMP WHERE createdAt IS NULL;
            `);
        }

        // 3. ĐIỀN DỮ LIỆU BAN ĐẦU (NẾU BẢNG TRỐNG)
        const productsCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM products;');
        if (productsCount && productsCount.count === 0) {
            console.log('Inserting initial categories and products...');

            // Insert Categories
            for (const cat of initialCategories) {
                await db.runAsync('INSERT INTO categories (id, name, iconUri) VALUES (?, ?, ?);', [cat.id, cat.name, cat.iconUri ?? null]);
            }

            // Insert Products
            for (const prod of initialProducts) {
                await db.runAsync('INSERT INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?);', [prod.id, prod.name, prod.price, prod.img, prod.categoryId]);
            }

            // Thêm user admin mặc định nếu chưa có
            await db.runAsync(
                'INSERT INTO users (username, password, isAdmin, phone) VALUES (?, ?, ?, ?);',
                ['admin', 'admin123', 1, '0901234567'] // Cảnh báo: KHÔNG sử dụng mật khẩu clear text trong sản phẩm thật
            );
        }

        // 4. Gọi callback sau khi hoàn tất
        callback();
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};


// ===============================================
// 4. DATABASE API FUNCTIONS (Đã giữ nguyên)
// ===============================================

// Hàm fetchCategories đã giữ nguyên
export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const db = getDatabase();
        const result = await db.getAllAsync('SELECT * FROM categories;');
        return result;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Hàm fetchProducts đã giữ nguyên
export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const db = getDatabase();
        const result = await db.getAllAsync('SELECT * FROM products;');
        return result;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Các hàm CRUD Product đã giữ nguyên
export const addProduct = async (product: Omit<Product, 'id'>): Promise<void> => {
    try {
        const db = getDatabase();
        await db.runAsync(
            'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?);',
            [product.name, product.price, product.img, product.categoryId]
        );
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const updateProduct = async (product: Product): Promise<void> => {
    try {
        const db = getDatabase();
        await db.runAsync(
            'UPDATE products SET name = ?, price = ?, img = ?, categoryId = ? WHERE id = ?;',
            [product.name, product.price, product.img, product.categoryId, product.id]
        );
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id: number): Promise<void> => {
    try {
        const db = getDatabase();
        await db.runAsync('DELETE FROM products WHERE id = ?;', [id]);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Hàm tìm kiếm sản phẩm theo tên hoặc danh mục đã giữ nguyên
export const searchProductsByNameOrCategory = async (keyword: string): Promise<Product[]> => {
    try {
        const db = getDatabase();
        const result = await db.getAllAsync(
            `SELECT p.* FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        WHERE p.name LIKE ? OR c.name LIKE ?;`,
            [`%${keyword}%`, `%${keyword}%`]
        );
        return result;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// Hàm tìm kiếm theo giá đã giữ nguyên
export const fetchProductsByPriceRange = async (minPrice: number, maxPrice: number): Promise<Product[]> => {
    try {
        const db = getDatabase();
        const result = await db.getAllAsync(
            `SELECT * FROM products WHERE price >= ? AND price <= ?;`,
            [minPrice, maxPrice]
        );
        return result;
    } catch (error) {
        console.error('Error fetching products by price range:', error);
        throw error;
    }
};

// Hàm CRUD Category đã giữ nguyên
export const addCategory = async (category: Omit<Category, 'id'>): Promise<void> => {
    try {
        const db = getDatabase();
        await db.runAsync(
            'INSERT INTO categories (name, iconUri) VALUES (?, ?);',
            [category.name, category.iconUri || null]
        );
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

export const deleteCategory = async (id: number): Promise<void> => {
    try {
        const db = getDatabase();
        await db.runAsync('DELETE FROM categories WHERE id = ?;', [id]);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

// Cập nhật category
export const updateCategory = async (category: Category): Promise<void> => {
    try {
        const db = getDatabase();
        await db.runAsync(
            'UPDATE categories SET name = ?, iconUri = ? WHERE id = ?;',
            [category.name, category.iconUri || null, category.id]
        );
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    try {
        const db = getDatabase();
        const result = await db.getAllAsync('SELECT * FROM products WHERE categoryId = ?;', [categoryId]);
        return result;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

// Các hàm User và Authentication đã giữ nguyên
export const addUser = async (user: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<number> => {
    try {
        const db = getDatabase();
        const result = await db.runAsync(
            'INSERT INTO users (username, password, isAdmin, phone) VALUES (?, ?, ?, ?);',
            [user.username, user.password, user.isAdmin ? 1 : 0, user.phone || null]
        );
        return result.lastInsertRowId as number;
    } catch (error) {
        throw error;
    }
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    try {
        const db = getDatabase();
        // Chỉ chọn các cột cần thiết (password được fetch để so sánh)
        const result = await db.getAllAsync('SELECT id, username, password, isAdmin, phone, createdAt FROM users WHERE username = ?;', [username]);
        // Cần đảm bảo isAdmin là boolean (nếu trong DB là 0/1)
        return result.length > 0 ? { ...result[0], isAdmin: !!result[0].isAdmin } : null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Cập nhật thông tin user (password, phone)
export const updateUser = async (id: number, fields: { password?: string; phone?: string | null }): Promise<void> => {
    try {
        const db = getDatabase();
        const updates: string[] = [];
        const params: any[] = [];
        if (fields.password !== undefined) {
            updates.push('password = ?');
            params.push(fields.password);
        }
        if (fields.phone !== undefined) {
            updates.push('phone = ?');
            params.push(fields.phone || null);
        }
        if (updates.length === 0) return;
        params.push(id);
        const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?;`;
        await db.runAsync(sql, params);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Các hàm Order đã giữ nguyên (Đã tích hợp cột phone)
export const createOrder = async (userId: number, items: { productId: number; quantity: number; price: number }[], total: number, address: string, phone?: string): Promise<number> => {
    try {
        const db = getDatabase();
        // Insert order with phone
        const orderResult = await db.runAsync(
            'INSERT INTO orders (userId, total, status, address, phone) VALUES (?, ?, ?, ?, ?);',
            [userId, total, 'pending', address, phone || null]
        );
        const orderId = orderResult.lastInsertRowId as number;

        // Insert order items
        for (const item of items) {
            await db.runAsync(
                'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?);',
                [orderId, item.productId, item.quantity, item.price]
            );
        }

        return orderId;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const fetchOrdersByUser = async (userId: number): Promise<Order[]> => {
    try {
        const db = getDatabase();
        const result = await db.getAllAsync('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC;', [userId]);
        return result;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const fetchOrderItems = async (orderId: number): Promise<OrderItem[]> => {
    try {
        const db = getDatabase();
        const result = await db.getAllAsync('SELECT * FROM order_items WHERE orderId = ?;', [orderId]);
        return result;
    } catch (error) {
        console.error('Error fetching order items:', error);
        throw error;
    }
};

export const fetchAllOrders = async (): Promise<OrderWithPhone[]> => {
    try {
        const db = getDatabase();
        // Lấy tất cả các cột từ bảng orders, bao gồm cả phone đã được thêm vào
        const result = await db.getAllAsync(`
          SELECT *
          FROM orders
          ORDER BY createdAt DESC;
        `);
        return result;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
    try {
        const db = getDatabase();
        await db.runAsync('UPDATE orders SET status = ? WHERE id = ?;', [status, orderId]);
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};