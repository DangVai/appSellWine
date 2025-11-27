import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, Alert, Image, Dimensions, ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import Database & Models (Đảm bảo đường dẫn đúng với project của bạn)
import { fetchProducts, deleteProduct as deleteProductDB } from '../../../database/database';
import { Product } from '../../Products/models/Product'; // Hoặc đường dẫn file model của bạn

import AppHeader from '../../../components/AppHeader';
import AppFooter from '../../../components/AppFooter';

// --- CẤU HÌNH GIAO DIỆN GRID ---
const { width } = Dimensions.get('window');
const SPACING = 12; // Khoảng cách giữa các ô
const COLUMN_WIDTH = (width - SPACING * 3) / 2; // Tính toán chiều rộng để chia đều 2 cột

// Định nghĩa kiểu cho Navigation
type RootStackParamList = {
    AddProduct: { productId?: number };
};
type ProductManagementNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProductManagement() {
    const navigation = useNavigation<ProductManagementNavigationProp>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // --- 1. LOAD DỮ LIỆU ---
    // Sử dụng useFocusEffect để tự động load lại khi quay về màn hình này
    useFocusEffect(
        useCallback(() => {
            loadProducts();
        }, [])
    );

    const loadProducts = async () => {
        setLoading(true);
        try {
            const allProducts = await fetchProducts();
            // Đảo ngược mảng để sản phẩm mới nhất lên đầu
            setProducts(allProducts.reverse());
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    // --- 2. XỬ LÝ HÌNH ẢNH ---
    const getImageSource = (img?: string) => {
        const defaultImg = require('../../../assets/images/products/chup-anh-quang-cao-chai-ruou-vang-wine-bottle-photography_0001.jpg'); // Ảnh mặc định
        if (!img) return defaultImg;

        if (img.startsWith('file://')) {
            return { uri: img }; // Ảnh từ thư viện máy
        }

        // Mapping ảnh tĩnh (nếu bạn lưu tên file trong DB)
        // Bạn có thể mở rộng danh sách này
        switch (img) {
            case 'hinh1.jpg': return defaultImg;
            default: return defaultImg;
        }
    };

    // --- 3. CHỨC NĂNG SỬA / XÓA ---
    const handleEdit = (product: Product) => {
        // Chuyển sang màn hình AddProduct và gửi kèm ID để sửa
        navigation.navigate('AddProduct', { productId: product.id });
    };

    const handleDelete = (product: Product) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc muốn xóa "${product.name}" không?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (product.id) {
                                await deleteProductDB(product.id);
                                loadProducts(); // Load lại sau khi xóa
                                Alert.alert('Thành công', 'Đã xóa sản phẩm');
                            }
                        } catch (e) {
                            Alert.alert('Lỗi', 'Xóa thất bại');
                        }
                    }
                },
            ]
        );
    };

    // --- 4. GIAO DIỆN TỪNG SẢN PHẨM (GRID ITEM) ---
    const renderProductItem = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail' as any, { product: item } as any)}>
            {/* Ảnh sản phẩm */}
            <View style={styles.imageContainer}>
                <Image
                    source={getImageSource(item.img ?? 'hinh1.jpg')}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{item.price.toLocaleString()} đ</Text>
                </View>
            </View>

            {/* Thông tin & Nút bấm */}
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.btnEdit]}
                        onPress={() => handleEdit(item)}
                    >
                        <Text style={styles.btnText}>Sửa</Text>
                    </TouchableOpacity>

                    <View style={{ width: 8 }} />

                    <TouchableOpacity
                        style={[styles.btn, styles.btnDelete]}
                        onPress={() => handleDelete(item)}
                    >
                        <Text style={styles.btnText}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    // --- 5. RENDER CHÍNH ---
    return (
        <View style={styles.container}>
            <AppHeader />

            <View style={styles.body}>
                <Text style={styles.headerTitle}>📦 Danh Sách Sản Phẩm</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        renderItem={renderProductItem}

                        // Cấu hình Grid 2 cột
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        contentContainerStyle={styles.listContent}

                        ListEmptyComponent={
                            <View style={styles.emptyView}>
                                <Text style={{ fontSize: 40 }}>📭</Text>
                                <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
                                <TouchableOpacity
                                    style={styles.btnAddNow}
                                    onPress={() => navigation.navigate('AddProduct', {})}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Thêm ngay</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
            </View>

            <AppFooter activeScreen="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    body: { flex: 1 },

    headerTitle: {
        fontSize: 20, fontWeight: 'bold', color: '#333',
        padding: 16, paddingBottom: 8
    },

    listContent: {
        paddingHorizontal: SPACING,
        paddingBottom: 80, // Để không bị che bởi Footer
    },

    // --- CARD STYLES ---
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: SPACING,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
        elevation: 3, // Bóng đổ cho Android
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        height: COLUMN_WIDTH, // Ảnh vuông
        width: '100%',
    },
    cardImage: {
        width: '100%', height: '100%',
    },
    priceTag: {
        position: 'absolute', bottom: 8, right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 6,
    },
    priceText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

    cardContent: { padding: 10 },
    cardTitle: {
        fontSize: 14, fontWeight: '600', color: '#333',
        height: 38, // Cố định chiều cao tên để các thẻ bằng nhau
        marginBottom: 8,
    },

    // --- ACTION BUTTONS ---
    actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
    btn: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center', justifyContent: 'center',
    },
    btnEdit: { backgroundColor: '#e7f3ff' },
    btnDelete: { backgroundColor: '#ffecec' },

    btnText: { fontSize: 12, fontWeight: '600', color: '#333' },

    // --- EMPTY STATE ---
    emptyView: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#888', marginTop: 10, fontSize: 16 },
    btnAddNow: {
        marginTop: 15, backgroundColor: '#28a745',
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20
    }
});