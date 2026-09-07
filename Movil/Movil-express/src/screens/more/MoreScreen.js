import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';

export default function MoreScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const menuOptions = [
    {
      id: 'about',
      title: '¿Quiénes Somos?',
      subtitle: 'Historia, misión, visión y objetivos de la empresa',
      icon: 'business-outline',
      color: '#2563eb',
      screen: 'AboutUs',
    },
    {
      id: 'contact',
      title: 'Contáctenos',
      subtitle: 'Soporte, ubicaciones, WhatsApp y formulario directo',
      icon: 'call-outline',
      color: '#059669',
      screen: 'Contact',
    },
    {
      id: 'reviews',
      title: 'Valoraciones y Reseñas',
      subtitle: 'Opiniones de nuestros clientes y califica el servicio',
      icon: 'star-outline',
      color: '#d97706',
      screen: 'Reviews',
    },
    {
      id: 'terms',
      title: 'Términos y Condiciones',
      subtitle: 'Políticas de privacidad, compras y devoluciones',
      icon: 'document-text-outline',
      color: '#7c3aed',
      screen: 'Terms',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Banner Superior */}
      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="settings" size={28} color="#fff" />
        </View>
        <Text style={styles.bannerTitle}>Más Opciones</Text>
        <Text style={styles.bannerSubtitle}>Información y servicios de Express Spare Parts</Text>
      </View>

      {/* Lista de Páginas */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Páginas Informativas</Text>

        {menuOptions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sección Sobre la Aplicación */}
      <View style={styles.appInfoCard}>
        <View style={styles.appInfoRow}>
          <Ionicons name="information-circle-outline" size={20} color="#64748b" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.appInfoTitle}>Express Spare Parts Móvil</Text>
            <Text style={styles.appInfoVersion}>Versión 1.0.0 • Distribución de Repuestos</Text>
          </View>
        </View>
      </View>

      {/* Botón Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
        <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  banner: {
    backgroundColor: '#1e3d8a',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#1e3d8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bannerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#93c5fd',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  appInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  appInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  appInfoVersion: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 14,
    borderRadius: 14,
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
