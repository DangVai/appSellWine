import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product } from '../models/Product';

import { useCart } from '../../../context/CartContext';
import AppHeader from '../../../components/AppHeader';
import AppFooter from '../../../components/AppFooter';

// Định nghĩa RootStackParamList đầy đủ để tránh lỗi TypeScript ở AppFooter/Navigation
type RootStackParamList = {
    Home: undefined;
    Explore: undefined;
    ProductDetail: { product: Product };
    Cart: undefined;
    Admin: undefined;
    CategoryManagement: undefined;
    User: undefined;
    About: undefined;
    ProductsByCategory: { categoryId: number, categoryName: string };
    // Thêm các màn hình khác nếu cần
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

interface Props {
    route: ProductDetailRouteProp;
    navigation: ProductDetailNavigationProp;
}

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const { product } = route.params;
    const { addToCart } = useCart();

    // Lấy tên sản phẩm chính xác
    const productName = product.name || (product as any).title || 'Sản phẩm không tên';
    const productDescription = (product as any).description || `Mô tả sản phẩm: ${productName} là một loại rượu vang cao cấp, mang lại trải nghiệm hương vị tinh tế và đáng nhớ.`;

    const getImageSource = (img?: string) => {
        const cleanImg = img?.trim();
        if (cleanImg && (cleanImg.startsWith('file://') || cleanImg.startsWith('http'))) {
            return { uri: cleanImg };
        }
        // Sử dụng ảnh rượu vang mặc định
        return require('../../../assets/images/products/chup-anh-quang-cao-chai-ruou-vang-wine-bottle-photography_0001.jpg');
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN');
    };

    const handleAddToCart = () => {
        addToCart(product);
        Alert.alert('Thành công', `${productName} đã được thêm vào giỏ hàng!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigation.navigate('Cart');
    };

    return (
        
        // Bọc toàn bộ View trong ScrollView và thêm style flex: 1 cho ScrollView
        <View style={styles.container}>
            <AppHeader />

            <ScrollView style={styles.contentWrapper}>
                {/* Image Section */}
                <Image
                    source={getImageSource(product.img || (product as any).image)}
                    style={styles.image}
                    resizeMode="contain" // Thay đổi sang 'contain' để chai rượu không bị cắt
                />

                {/* Details Section */}
                <View style={styles.details}>
                    <Text style={styles.name}>{productName}</Text>
                    <Text style={styles.price}>{formatPrice(product.price)} ₫</Text>
                    {/* Button Section */}
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                            <Text style={styles.buttonText}>➕ Thêm vào giỏ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buyButton]} onPress={handleBuyNow}>
                            <Text style={styles.buttonText}>Mua ngay</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Placeholder cho thông tin chi tiết (ví dụ: Xuất xứ, Năm, Loại) */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>🍇 Loại: Vang Đỏ</Text>
                        <Text style={styles.infoText}>🇫🇷 Xuất xứ: Bordeaux</Text>
                        <Text style={styles.infoText}>📅 Vintage: 2018</Text>
                    </View>

                    <Text style={styles.descriptionHeader}>Mô tả chi tiết</Text>
                    <Text style={styles.description}>
                        {productDescription}
                    </Text>
                </View>
            </ScrollView>

            {/* Đảm bảo AppFooter không bị cắt */}
            <AppFooter activeScreen="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7', // Nền sáng hơn
    },
    scrollContent: {
        paddingBottom: 100, // Cần padding lớn hơn để tránh AppFooter che mất nội dung cuối
    },
    contentWrapper: {
        paddingHorizontal: 20, // Giữ padding nội dung
    },
    image: {
        width: '100%',
        height: 350, // Tăng chiều cao để xem chai rượu rõ hơn
        borderRadius: 12,
        backgroundColor: '#FFFFFF', // Nền trắng cho khu vực ảnh
        marginTop: 10,
        // Dùng resizeMode: 'contain' trong component
    },
    details: {
        marginTop: 25,
        paddingBottom: 10,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    price: {
        fontSize: 24,
        color: '#B83227', // Màu giá đỏ rượu vang
        fontWeight: '700',
        marginBottom: 20,
    },
    descriptionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginTop: 15,
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    infoBox: {
        backgroundColor: '#F0F8FF', // Nền xanh nhạt cho thông tin nổi bật
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 3,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 20, // Thêm khoảng cách trước footer
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        borderRadius: 10, // Góc bo tròn nhẹ
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buyButton: {
        backgroundColor: '#B83227', // Màu mua ngay đồng bộ với màu giá
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProductDetailScreen;