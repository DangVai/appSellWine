import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// *** THÊM IMPORT NÀY ***
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import AdminFooter from './AdminFooter';

// Giả định RootStackParamList...
type RootStackParamList = {
    Home: undefined;
    Explore: undefined;
    Cart: undefined;
    User: undefined;
    [key: string]: any;
};


const navItemsData: { label: string; icon: string; screen: keyof RootStackParamList }[] = [
    { label: "Trang chủ", icon: "🏠", screen: "Home" },
    { label: "Khám Phá", icon: "💎", screen: "Explore" },
    { label: "Giỏ hàng", icon: "🛒", screen: "Cart" },
    { label: "Cá nhân", icon: "👤", screen: "User" },
];

interface BottomNavItemProps {
    label: string;
    icon: string;
    isActive: boolean;
    screen: keyof RootStackParamList;
}

function BottomNavItem({ label, icon, isActive, screen }: BottomNavItemProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handlePress = () => {
        navigation.navigate(screen as string);
    };

    return (
        <TouchableOpacity style={styles.navItem} onPress={handlePress}>
            <View style={styles.iconContainer}>
                <Text style={[styles.navIcon, isActive && { color: '#007bff' }]}>{icon}</Text>
            </View>
            <Text style={[styles.navText, isActive && { color: '#007bff' }]}>{label}</Text>
        </TouchableOpacity>
    );
}
export default function AppFooter({ activeScreen }: { activeScreen: keyof RootStackParamList }) {
    const { isAdmin } = useAuth();

    // If user is admin, show AdminFooter instead
    if (isAdmin) {
        return <AdminFooter activeScreen={activeScreen as string} />;
    }

    // Otherwise show regular user footer
    return (
        <SafeAreaView style={styles.bottomNavContainer}>
            <View style={styles.bottomNav}>
                {/* ... mapping navItemsData giữ nguyên ... */}
                {navItemsData.map((item) => (
                    <BottomNavItem
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        isActive={item.screen === activeScreen}
                        screen={item.screen}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bottomNavContainer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 3,
    },
    navItem: {
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginBottom: 3,
    },
    navIcon: {
        fontSize: 18,
        fontWeight: 'normal',
    },
    navText: {
        fontWeight: 'normal',
        textAlign: 'center',
    },
});