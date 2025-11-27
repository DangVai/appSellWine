import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Giả định: File Product model và database function đã được import đúng
import AppHeader from '../../../components/AppHeader';
import AppFooter from '../../../components/AppFooter';
import { fetchProducts, searchProductsByNameOrCategory, Product } from '../../../database/database';
import { fetchProductsByPriceRange } from '../../../database/database';

// Cần đảm bảo RootStackParamList này khớp với file AppNavigator.tsx của bạn
type RootStackParamList = {
    Home: undefined;
    Explore: undefined;
    ProductDetail: { product: Product };
    Cart: undefined;
    Admin: undefined;
    // Thêm các route khác nếu cần
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2; // 2 items per row with padding

export default function ExploreScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Hàm tải và lọc sản phẩm (Đã được tối ưu)
    useEffect(() => {
        const loadProducts = async () => {
            try {
                // 1. Kiểm tra LỌC THEO GIÁ
                if (minPrice !== '' && maxPrice !== '') {
                    const min = parseFloat(minPrice);
                    const max = parseFloat(maxPrice);

                    if (!isNaN(min) && !isNaN(max) && min <= max) {
                        // Nếu có bộ lọc giá hợp lệ, hãy gọi API lọc theo giá
                        const filteredByPrice = await fetchProductsByPriceRange(min, max);
                        // TODO: Nếu bạn muốn kết hợp lọc giá VÀ từ khóa, bạn cần thêm logic lọc từ khóa vào đây
                        setProducts(filteredByPrice);
                        return; // Ngừng thực thi để chỉ áp dụng lọc giá
                    }
                }

                // 2. Kiểm tra TÌM KIẾM THEO TỪ KHÓA
                if (searchKeyword.trim() !== '') {
                    const searchedProducts = await searchProductsByNameOrCategory(searchKeyword);
                    setProducts(searchedProducts);
                    return; // Ngừng thực thi để chỉ áp dụng tìm kiếm từ khóa
                }

                // 3. Tải TẤT CẢ SẢN PHẨM (Mặc định)
                const fetchedProducts = await fetchProducts();
                setProducts(fetchedProducts);

            } catch (error) {
                console.error('Lỗi khi tải sản phẩm:', error);
            }
        };

        // **LƯU Ý QUAN TRỌNG:** Với logic hiện tại (lọc giá ưu tiên hơn tìm kiếm từ khóa), 
        // code này sẽ tự động tải lại mỗi khi bạn gõ bất kỳ chữ cái hay số nào vào ô tìm kiếm hoặc lọc giá.
        loadProducts();
    }, [searchKeyword, minPrice, maxPrice]);

    const onSearchChange = (keyword: string) => {
        setSearchKeyword(keyword);
    };

    const onMinPriceChange = (value: string) => {
        setMinPrice(value.replace(/[^0-9]/g, '')); // Chỉ cho phép số
    };

    const onMaxPriceChange = (value: string) => {
        setMaxPrice(value.replace(/[^0-9]/g, '')); // Chỉ cho phép số
    };


    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
            <Image
                source={item.img ? { uri: item.img } : require('../../../assets/images/products/chup-anh-quang-cao-chai-ruou-vang-wine-bottle-photography_0001.jpg')}
                style={styles.productImage}
                resizeMode="cover"
            />
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}₫</Text>
        </TouchableOpacity>
    );

    // Bắt đầu khối RETURN chính xác (ĐÃ GỠ BỎ KHỐI RETURN THỪA)
    return (
        <View style={styles.container}>
            <AppHeader />
            <Text style={styles.heading}>Khám Phá Sản Phẩm</Text>

            {/* Thanh tìm kiếm */}
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm sản phẩm hoặc thương hiệu"
                value={searchKeyword}
                onChangeText={onSearchChange}
                clearButtonMode="while-editing"
            />

            {/* Bộ lọc giá */}
            <View style={styles.priceFilterContainer}>
                <TextInput
                    style={styles.priceInput}
                    placeholder="Giá từ"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={onMinPriceChange}
                />
                <Text style={styles.toText}>-</Text>
                <TextInput
                    style={styles.priceInput}
                    placeholder="Đến"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={onMaxPriceChange}
                />
            </View>

            {/* Danh sách sản phẩm */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProduct}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Không tìm thấy sản phẩm nào.</Text>}
            />

            <AppFooter activeScreen="Explore" />
        </View>
    );
}
// Kết thúc component ExploreScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        paddingHorizontal: 15,
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    productItem: {
        width: itemWidth,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 12,
        color: '#555',
        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        marginHorizontal: 15,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    priceFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    priceInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    toText: {
        marginHorizontal: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
});