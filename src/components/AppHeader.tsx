import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

type RootStackParamList = {
    Cart: undefined;
    Admin: undefined;
    Login: undefined;
    ProductsByCategory: { categoryId: number; categoryName: string };
    About: undefined;
    Home: undefined;
    Explore: undefined;
    CategoryManagement: undefined;
    User: undefined;
    AddProduct: undefined;
    EditProduct: { productId: number };
    UserManagement: undefined;
    ProductManagement: undefined;
};

export default function AppHeader() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Sử dụng useRoute để lấy tên màn hình hiện tại
    const route = useRoute();
    const currentRouteName = route.name; // Tên màn hình hiện tại

    const { user, isAdmin, logout } = useAuth(); // Bỏ navigationAbout và navigationByCategory không cần thiết

    // Hàm kiểm tra tab đang active
    const isActiveTab = (tabName: string): boolean => {
        // Tab Hãng Rượu/Sản phẩm chính là màn hình Home
        if (tabName === 'Home') {
            return currentRouteName === 'Home' || currentRouteName === 'ProductsByCategory' && (route.params as { categoryId: number })?.categoryId !== 0;
        }
        // Tab Giới thiệu
        if (tabName === 'About') {
            return currentRouteName === 'About';
        }
        // Tab Dành mục sản phẩm (Giả định categoryId = 0 là Dành mục sản phẩm)
        if (tabName === 'NewProducts') {
            return currentRouteName === 'ProductsByCategory' && (route.params as { categoryId: number })?.categoryId === 0;
        }
        return false;
    };

    // Hàm render Tab Item để tránh lặp code
    const TabItem = ({ name, targetScreen, params, activeCheck }: { name: string, targetScreen: keyof RootStackParamList, params?: any, activeCheck: string }) => {
        const isActive = isActiveTab(activeCheck);

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate(targetScreen as any, params)}
            >
                <Text style={[styles.tabText, isActive && styles.activeTab]}>
                    {name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            {/* ... Phần Top Bar (Logo, Cart, User) Giữ Nguyên ... */}
            <View style={styles.topBar}>
                <Text style={styles.title}>🍾 Wine Cellar</Text>
                <View style={styles.topBarRight}>
                    <TouchableOpacity><Text style={styles.topBarText}>💬</Text></TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Text style={styles.topBarText}>🛒</Text>
                    </TouchableOpacity>

                    {user ? (
                        <View style={styles.userSectionRow}>
                            <Text style={styles.userText}>{user}</Text>
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={() => {
                                    Alert.alert('Xác nhận', 'Bạn có muốn đăng xuất không?', [
                                        { text: 'Hủy', style: 'cancel' },
                                        { text: 'Đăng xuất', style: 'destructive', onPress: () => { logout(); navigation.navigate('Home'); } }
                                    ]);
                                }}
                            >
                                <Text style={styles.logoutText}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Thanh truy cập Admin - Chỉ hiển thị nếu là admin */}
            {isAdmin && (
                <TouchableOpacity
                    style={{ padding: 10, backgroundColor: '#ffc107', borderRadius: 0 }}
                    onPress={() => navigation.navigate('Admin')}
                >
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>🔑 Trang Admin (Quản lý)</Text>
                </TouchableOpacity>
            )}

            {/* Thanh Điều Hướng Phụ (Tabs) */}
            <View style={styles.tabContainer}>
                {/* 1. Hãng Rượu (Home/ProductsByCategory) */}
                <TabItem
                    name="Home"
                    targetScreen="Home"
                    activeCheck="Home"
                />

                {/* 2. Giới thiệu (About) */}
                <TabItem
                    name="Giới thiệu"
                    targetScreen="About"
                    activeCheck="About"
                />

                {/* 3. Dành mục sản phẩm (ProductsByCategory với categoryId=0) */}
                <TabItem
                    name="Dành mục sản phẩm"
                    targetScreen="ProductsByCategory"
                    params={{ categoryId: 0, categoryName: 'Dành mục sản phẩm' }}
                    activeCheck="NewProducts"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fde047',
        paddingTop: 30,
        paddingBottom: 5,
    },

    topBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    topBarText: {
        fontSize: 22,
        color: '#000',
    },
    userSection: {
        alignItems: 'flex-end',
    },
    userSectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoutButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    logoutText: {
        color: '#dc3545',
        fontWeight: 'bold',
    },
    userText: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
    loginText: {
        fontSize: 14,
        color: '#007bff',
        fontWeight: 'bold',
    },

    // --- Secondary Tabs (Hãng Rượu, Giới thiệu, ...) ---
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'space-around',
    },
    tabText: {
        fontSize: 14,
        paddingHorizontal: 5,
        paddingVertical: 5,
        color: '#555',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        color: '#000',
        fontWeight: 'bold',
    }
});