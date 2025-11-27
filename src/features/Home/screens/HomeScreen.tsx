import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import components và database
import AppHeader from '../../../components/AppHeader';
import AppFooter from '../../../components/AppFooter';
import { initializeDatabase, fetchProducts, fetchCategories, Product, Category } from '../../../database/database';
import { useCart } from '../../../context/CartContext';

// Component cho một mục Quick View
const QuickViewItem = ({ item, onPress }: { item: Category; onPress: () => void }) => (
    <TouchableOpacity
        style={styles.quickViewItem}
        onPress={onPress}
    >
        <Image source={{ uri: item.iconUri || 'https://via.placeholder.com/100' }} style={styles.quickViewIcon} />
        <Text style={styles.quickViewText}>{item.name}</Text>
    </TouchableOpacity>
);

type RootStackParamList = {
    Home: undefined;
    ProductDetail: { product: Product };
    Cart: undefined;
    Admin: undefined;
    Explore: undefined;
    CategoryManagement: undefined;
    User: undefined;
    AddProduct: undefined;
    About: undefined;
    ProductsByCategory: { categoryId: number, categoryName: string };
};

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Initialize database 
                await initializeDatabase(() => {
                    console.log('Database initialized successfully!');
                });

                // Fetch data
                const existingProducts = await fetchProducts();
                setProducts(existingProducts);

                const existingCategories = await fetchCategories();
                setCategories(existingCategories);
            } catch (error) {
                console.error('Error loading home screen data:', error);
            }
        };
        loadData();
    }, []);

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN');
    };

    return (
        <View style={styles.container}>
            <AppHeader />

            {/* Danh sách Sản phẩm */}
            <FlatList
                data={products}
                keyExtractor={(item) => `product-${item.id}`}
                key={2}
                // >>> THAY ĐỔI 1: Thiết lập 2 cột
                numColumns={2}
                columnWrapperStyle={styles.row} // Áp dụng khoảng cách giữa các cột
                renderItem={({ item }: { item: Product }) => (
                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
                        <Image
                            source={item.img ? { uri: item.img } : require('../../../assets/images/products/chup-anh-quang-cao-chai-ruou-vang-wine-bottle-photography_0001.jpg')}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>{formatPrice(item.price)}₫</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={(e) => { e.stopPropagation?.(); addToCart(item); }}
                        >
                            <Text style={styles.buttonText}>Thêm vào giỏ</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                // **GIẢI PHÁP CHO LỖI TEXT STRING:** Bọc toàn bộ header trong một <View> duy nhất
                ListHeaderComponent={
                    <View>
                        {/* Banner Quảng Cáo */}
                        <View style={styles.bannerContainer}>
                            <Image source={require('../../../assets/images/products/chup-anh-quang-cao-chai-ruou-vang-wine-bottle-photography_0001.jpg')} style={styles.bannerImage} />
                        </View>

                        {/* Phần "Thương Hiệu Nổi Bật" */}
                        <Text style={styles.quickViewHeading}>Thương Hiệu Nổi Bật</Text>
                        <View style={styles.quickViewGrid}>
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => item.id.toString()}
                                key={3}
                                renderItem={({ item }: { item: Category }) => <QuickViewItem item={item} onPress={() => navigation.navigate('ProductsByCategory', { categoryId: item.id, categoryName: item.name })} />}
                                numColumns={3}
                                scrollEnabled={false}
                                columnWrapperStyle={styles.quickViewRow}
                            />
                        </View>
                        <Text style={styles.heading}>Danh sách sản phẩm</Text>
                    </View>
                }
                contentContainerStyle={styles.flatListContentContainer}
            />

            <AppFooter activeScreen="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    // --- Banner Quảng Cáo ---
    bannerContainer: {
        width: '100%',
        height: 200,
        marginBottom: 15,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // --- Quick View / Categories (Thương Hiệu Nổi Bật) ---
    quickViewHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    quickViewGrid: {
        paddingHorizontal: 10,
    },
    quickViewRow: {
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    quickViewItem: {
        width: '30%',
        alignItems: 'center',
        padding: 5,
    },
    quickViewIcon: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 5,
        resizeMode: 'contain',
        backgroundColor: '#f0f0f0',
    },
    quickViewText: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
    },

    // --- Danh sách Sản phẩm (2 cột) ---
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingHorizontal: 15,
        marginTop: 15,
    },
    // >>> THAY ĐỔI 2: Tạo khoảng cách giữa các cột
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 15, // Đảm bảo padding cho container chính
    },
    item: {
        // >>> THAY ĐỔI 3: Thiết lập chiều rộng cho 2 cột
        width: '48%', // Chiếm gần 50% (để lại khoảng trống 4% cho margin và space-between)
        padding: 10, // Giảm padding nội bộ để tiết kiệm không gian
        backgroundColor: '#f5f5f5',
        marginBottom: 15, // Tăng khoảng cách dưới để phân tách hàng
        borderRadius: 10,
        // marginHorizontal: 15, // Đã di chuyển logic khoảng cách sang row
    },
    productImage: {
        width: '100%',
        height: 120, // Giảm chiều cao ảnh để tiết kiệm không gian dọc
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: 'contain', // Thay đổi sang contain để hiển thị chai rượu tốt hơn
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 14, // Giảm kích thước chữ
        fontWeight: '600',
        height: 35, // Cố định chiều cao cho 2 dòng tên
    },
    price: {
        fontSize: 13,
        color: '#B83227', // Màu giá nổi bật
        marginBottom: 5,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 6,
        borderRadius: 6,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    flatListContentContainer: {
        paddingBottom: 20,
    },
});