import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import AppFooter from '../../../components/AppFooter';

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
}

export default function UserManagement() {
    const navigation = useNavigation<UserManagementNavigationProp>();
    const [users, setUsers] = useState<User[]>([]);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newUsername, setNewUsername] = useState('');
    const [isNewUserAdmin, setIsNewUserAdmin] = useState(false);

    useEffect(() => {
        // Mock data for demonstration - in real app, this would come from API
        const mockUsers: User[] = [
            { id: 1, username: 'admin', isAdmin: true, createdAt: '2024-01-01' },
            { id: 2, username: 'user1', isAdmin: false, createdAt: '2024-01-15' },
        ];
        setUsers(mockUsers);
    }, []);

    const handleDeleteUser = (userId: number, username: string) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc muốn xóa tài khoản "${username}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        setUsers(users.filter(user => user.id !== userId));
                        Alert.alert('Thành công', 'Đã xóa tài khoản người dùng');
                    }
                }
            ]
        );
    };

    const handleAddUser = () => {
        if (!newUsername.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên người dùng');
            return;
        }
        const newUser: User = {
            id: Math.max(...users.map(u => u.id)) + 1,
            username: newUsername.trim(),
            isAdmin: isNewUserAdmin,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        setNewUsername('');
        setIsNewUserAdmin(false);
        setIsAddingUser(false);
        Alert.alert('Thành công', 'Đã thêm người dùng mới');
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setNewUsername(user.username);
        setIsNewUserAdmin(user.isAdmin);
    };

    const handleSaveEdit = () => {
        if (!newUsername.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên người dùng');
            return;
        }
        setUsers(users.map(u => u.id === editingUser!.id ? { ...u, username: newUsername.trim(), isAdmin: isNewUserAdmin } : u));
        setEditingUser(null);
        setNewUsername('');
        setIsNewUserAdmin(false);
        Alert.alert('Thành công', 'Đã cập nhật người dùng');
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setNewUsername('');
        setIsNewUserAdmin(false);
    };

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.userItem}>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.userRole}>
                    {item.isAdmin ? 'Quản trị viên' : 'Người dùng'}
                </Text>
                <Text style={styles.createdAt}>Tạo: {item.createdAt}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditUser(item)}
                >
                    <Text style={styles.editText}>Sửa</Text>
                </TouchableOpacity>
                {!item.isAdmin && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteUser(item.id, item.username)}
                    >
                        <Text style={styles.deleteText}>Xóa</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader />

            <View style={styles.content}>
                <Text style={styles.title}>Quản Lý Người Dùng</Text>
                <Text style={styles.subtitle}>Tổng số: {users.length} tài khoản</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsAddingUser(!isAddingUser)}
                >
                    <Text style={styles.addButtonText}>
                        {isAddingUser ? 'Hủy Thêm' : '+ Thêm Người Dùng'}
                    </Text>
                </TouchableOpacity>

                {isAddingUser && (
                    <View style={styles.addForm}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên người dùng"
                            value={newUsername}
                            onChangeText={setNewUsername}
                        />
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => setIsNewUserAdmin(!isNewUserAdmin)}
                            >
                                <Text style={styles.checkboxText}>
                                    {isNewUserAdmin ? '☑' : '☐'} Quản trị viên
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleAddUser}
                        >
                            <Text style={styles.submitText}>Thêm</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {editingUser && (
                    <View style={styles.editForm}>
                        <Text style={styles.editTitle}>Chỉnh sửa: {editingUser.username}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên người dùng"
                            value={newUsername}
                            onChangeText={setNewUsername}
                        />
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => setIsNewUserAdmin(!isNewUserAdmin)}
                            >
                                <Text style={styles.checkboxText}>
                                    {isNewUserAdmin ? '☑' : '☐'} Quản trị viên
                                </Text>
                            </TouchableOpacity>
                        </View>
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

                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderUser}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <AppFooter activeScreen="Home" />
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
