import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import AppHeader from '../../../components/AppHeader';
import AppFooter from '../../../components/AppFooter';

const AboutScreen = () => {
    const handlePhonePress = () => {
        Linking.openURL('tel:+84123456789');
    };

    const handleEmailPress = () => {
        Linking.openURL('mailto:contact@vinevault.vn');
    };

    const handleLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f1f3f5' }}>
            <AppHeader />
            <ScrollView style={styles.contentContainer}>
                {/* App Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🍇 Thông Tin Ứng Dụng</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Tên ứng dụng:</Text>
                            <Text style={styles.value}>Vine Vault</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Phiên bản:</Text>
                            <Text style={styles.value}>1.0.0</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Mô tả:</Text>
                            <Text style={styles.descriptionText}>Ứng dụng bán lẻ rượu vang cao cấp với những lựa chọn đa dạng từ các vùng nho nổi tiếng trên thế giới.</Text>
                        </View>
                    </View>
                </View>

                {/* Company/Vineyard Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏛️ Về Công Ty</Text>
                    <View style={styles.card}>
                        <Text style={styles.companyName}>Vine Vault - Nhà Bán Lẻ Rượu Vang</Text>
                        <Text style={styles.descriptionText}>
                            Vine Vault là một nhà bán lẻ rượu vang hàng đầu chuyên cung cấp những chai rượu vang cao cấp từ các vùng nho nổi tiếng trên thế giới. Chúng tôi cam kết đem đến cho khách hàng những sản phẩm chất lượng tốt nhất với giá cả cạnh tranh.
                        </Text>
                        <Text style={styles.descriptionText}>
                            Với kinh nghiệm hơn 15 năm trong ngành, chúng tôi tự hào là đối tác tin cậy của hàng ngàn khách hàng yêu thích rượu vang tại cả nước.
                        </Text>
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📞 Thông Tin Liên Hệ</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
                            <Text style={styles.contactIcon}>☎️</Text>
                            <View>
                                <Text style={styles.contactLabel}>Điện thoại:</Text>
                                <Text style={styles.contactLink}>+84 (0) 123 456 789</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                            <Text style={styles.contactIcon}>✉️</Text>
                            <View>
                                <Text style={styles.contactLabel}>Email:</Text>
                                <Text style={styles.contactLink}>contact@vinevault.vn</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.contactItem}>
                            <Text style={styles.contactIcon}>📍</Text>
                            <View>
                                <Text style={styles.contactLabel}>Địa chỉ:</Text>
                                <Text style={styles.contactValue}>123 Đường Nguyễn Huệ, Q.1, TP.HCM</Text>
                            </View>
                        </View>

                        <View style={styles.contactItem}>
                            <Text style={styles.contactIcon}>🕐</Text>
                            <View>
                                <Text style={styles.contactLabel}>Giờ hoạt động:</Text>
                                <Text style={styles.contactValue}>Thứ 2 - Thứ 7: 9:00 - 21:00</Text>
                                <Text style={styles.contactValue}>Chủ nhật: 10:00 - 18:00</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* About the Team */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👥 Về Đội Ngũ</Text>
                    <View style={styles.card}>
                        <Text style={styles.teamMemberName}>👨‍💼 Nguyễn Văn An - Tổng Giám Đốc</Text>
                        <Text style={styles.teamMemberRole}>Có kinh nghiệm 20 năm trong ngành buôn bán rượu vang, chuyên gia về rượu vang Pháp.</Text>

                        <Text style={[styles.teamMemberName, { marginTop: 12 }]}>👩‍💼 Trần Thị Bình - Giám Đốc Kinh Doanh</Text>
                        <Text style={styles.teamMemberRole}>Điều hành các hoạt động kinh doanh và phát triển mối quan hệ khách hàng với chuyên môn cao.</Text>

                        <Text style={[styles.teamMemberName, { marginTop: 12 }]}>🧑‍💻 Lê Minh Tuấn - Trưởng Phòng Công Nghệ</Text>
                        <Text style={styles.teamMemberRole}>Phát triển và duy trì hệ thống bán hàng trực tuyến tiên tiến.</Text>
                    </View>
                </View>

                {/* Social Media */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🌐 Mạng Xã Hội</Text>
                    <View style={styles.card}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleLink('https://facebook.com/vinevault')}
                        >
                            <Text style={styles.socialIcon}>f</Text>
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleLink('https://instagram.com/vinevault')}
                        >
                            <Text style={styles.socialIcon}>📷</Text>
                            <Text style={styles.socialText}>Instagram</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleLink('https://twitter.com/vinevault')}
                        >
                            <Text style={styles.socialIcon}>𝕏</Text>
                            <Text style={styles.socialText}>Twitter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleLink('https://youtube.com/vinevault')}
                        >
                            <Text style={styles.socialIcon}>▶️</Text>
                            <Text style={styles.socialText}>YouTube</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Terms & Conditions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚖️ Điều Khoản & Điều Kiện</Text>
                    <View style={styles.card}>
                        <Text style={styles.agreementText}>
                            Bằng cách sử dụng ứng dụng Vine Vault, bạn đồng ý tuân thủ tất cả các điều khoản và điều kiện được quy định. Chúng tôi bảo lưu quyền thay đổi hoặc cập nhật các điều khoản này bất cứ lúc nào.
                        </Text>
                        <Text style={[styles.agreementText, { marginTop: 10 }]}>
                            • Các sản phẩm được bán với điều kiện có sẵn tại kho
                        </Text>
                        <Text style={styles.agreementText}>
                            • Khách hàng phải đủ 18 tuổi trở lên để mua rượu vang
                        </Text>
                        <Text style={styles.agreementText}>
                            • Chúng tôi bảo lưu quyền từ chối hoặc hủy đơn hàng
                        </Text>
                        <Text style={styles.agreementText}>
                            • Giá cả và tính khả dụng có thể thay đổi mà không có thông báo trước
                        </Text>
                    </View>
                </View>

                {/* Privacy Policy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔒 Chính Sách Bảo Mật</Text>
                    <View style={styles.card}>
                        <Text style={styles.agreementText}>
                            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Các dữ liệu cá nhân được thu thập sẽ được sử dụng để cải thiện dịch vụ và liên lạc với bạn về các ưu đãi mới.
                        </Text>
                        <Text style={[styles.agreementText, { marginTop: 10 }]}>
                            • Thông tin cá nhân được mã hóa và bảo vệ
                        </Text>
                        <Text style={styles.agreementText}>
                            • Chúng tôi không bao giờ chia sẻ thông tin với bên thứ ba mà không có sự đồng ý
                        </Text>
                        <Text style={styles.agreementText}>
                            • Bạn có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình
                        </Text>
                        <Text style={styles.agreementText}>
                            • Chúng tôi tuân thủ các quy định bảo vệ dữ liệu cá nhân
                        </Text>
                    </View>
                </View>

                {/* Footer Info */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <Text style={styles.footerText}>© 2024 Vine Vault. Tất cả quyền được bảo lưu.</Text>
                        <Text style={styles.footerText}>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!</Text>
                    </View>
                </View>
            </ScrollView>
            <AppFooter activeScreen="Home" />
        </View>
    );
}

export default AboutScreen

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    infoRow: {
        marginVertical: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    descriptionText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
        marginVertical: 4,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8B0000',
        marginBottom: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contactIcon: {
        fontSize: 20,
        marginRight: 12,
        width: 24,
    },
    contactLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
        marginBottom: 2,
    },
    contactLink: {
        fontSize: 14,
        color: '#007bff',
        fontWeight: '600',
    },
    contactValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    teamMemberName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 4,
    },
    teamMemberRole: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginVertical: 6,
    },
    socialIcon: {
        fontSize: 18,
        marginRight: 10,
        width: 24,
    },
    socialText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    agreementText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
    footerText: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        marginVertical: 4,
    },
})