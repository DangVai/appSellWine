import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import AppFooter from '../../../components/AppFooter';
import { fetchAllUsers, updateUser } from '../../../database/database';

type AdminStackParamList = {
    AdminDashboard: undefined;
    ProductManagement: undefined;
    AddProduct: undefined;
    EditProduct: { productId: number };
    UserManagement: undefined;
};

type UserManagementNavigationProp = NativeStackNavigationProp<AdminStackParamList, 'UserManagement'>;

interface User {
    id: number;
    username: string;
    isAdmin: boolean;
    createdAt: string;
    phone?: string;
}

export default function UserManagement() {
    const navigation = useNavigation<UserManagementNavigationProp>();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editPhone, setEditPhone] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editIsAdmin, setEditIsAdmin] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const dbUsers = await fetchAllUsers({ excludeAdmin: true });
            setUsers(dbUsers);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = (userId: number, username: string) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc muốn xóa tài khoản "${username}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        // Xóa user khỏi DB (bạn cần thêm hàm deleteUser nếu chưa có)
                        // await deleteUser(userId);
                        setUsers(users.filter(user => user.id !== userId));
                        Alert.alert('Thành công', 'Đã xóa tài khoản người dùng');
                    }
                }
            ]
        );
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setEditUsername(user.username);
        setEditPhone(user.phone || '');
        setEditPassword('');
        setEditIsAdmin(!!user.isAdmin);
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        if (!editUsername.trim()) {
            Alert.alert('Lỗi', 'Tên người dùng không được để trống');
            return;
        }
        try {
            await updateUser(editingUser.id, {
                phone: editPhone,
                password: editPassword ? editPassword : undefined,
                username: editUsername,
                isAdmin: editIsAdmin ? 1 : 0,
            });
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, username: editUsername, phone: editPhone, isAdmin: editIsAdmin } : u));
            setEditingUser(null);
            setEditPhone('');
            setEditUsername('');
            setEditPassword('');
            setEditIsAdmin(false);
            Alert.alert('Thành công', 'Đã cập nhật thông tin người dùng');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditPhone('');
        setEditUsername('');
        setEditPassword('');
        setEditIsAdmin(false);
    };

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.userItem}>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.userRole}>Người dùng</Text>
                <Text style={styles.createdAt}>Tạo: {item.createdAt}</Text>
                <Text style={styles.phone}>SĐT: {item.phone || 'Chưa có'}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditUser(item)}
                >
                    <Text style={styles.editText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteUser(item.id, item.username)}
                >
                    <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader />
            <View style={styles.content}>
                <Text style={styles.title}>Quản Lý Người Dùng</Text>
                <Text style={styles.subtitle}>Tổng số: {users.length} tài khoản</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 30 }} />
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderUser}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
                {editingUser && (
                    <View style={styles.editForm}>
                        <Text style={styles.editTitle}>Chỉnh sửa: {editingUser.username}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên người dùng mới"
                            value={editUsername}
                            onChangeText={setEditUsername}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Số điện thoại mới"
                            value={editPhone}
                            onChangeText={setEditPhone}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu mới (bỏ trống nếu không đổi)"
                            value={editPassword}
                            onChangeText={setEditPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setEditIsAdmin(!editIsAdmin)}
                        >
                            <Text style={styles.checkboxText}>{editIsAdmin ? '☑' : '☐'} Quản trị viên</Text>
                        </TouchableOpacity>
                        <View style={styles.editActions}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveEdit}
                            >
                                <Text style={styles.saveText}>Lưu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancelEdit}
                            >
                                <Text style={styles.cancelText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
            <AppFooter activeScreen="UserManagement" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    content: { flex: 1, padding: 20 },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333'
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center'
    },
    listContainer: { paddingBottom: 20 },
    userItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userInfo: { flex: 1 },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4
    },
    userRole: {
        fontSize: 14,
        color: '#007bff',
        marginBottom: 2
    },
    createdAt: {
        fontSize: 12,
        color: '#666'
    },
    phone: {
        fontSize: 13,
        color: '#333',
        marginTop: 2,
    },
    actions: { flexDirection: 'row' },
    editButton: {
        backgroundColor: '#ffc107',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginRight: 10,
    },
    editText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold'
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    deleteText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    addButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addForm: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    checkboxContainer: {
        marginBottom: 10,
    },
    checkbox: {
        padding: 5,
    },
    checkboxText: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editForm: {
        backgroundColor: '#fff3cd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ffeaa7',
    },
    editTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#856404',
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginRight: 5,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        padding: 12,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginLeft: 5,
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
