import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://10.10.0.186:4000/api';

export default function OrderHistoryScreen() {
  const { userData } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/venta/cliente/${userData?._id || ''}`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data || []);
      } else {
        // Fallback: Si no hay ruta específica por cliente, intenta historial o avisa
        setOrders([]);
      }
    } catch (error) {
      console.warn('Fetch orders error:', error);
      Alert.alert('Error', 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Pedido #{item._id?.slice(-6).toUpperCase()}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.date || item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.orderStatus}>
          Estado: <Text style={styles.statusValue}>{item.status || 'Completado'}</Text>
        </Text>
        <Text style={styles.orderTotal}>Total: ${Number(item.total || 0).toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No hay pedidos</Text>
          <Text style={styles.emptyText}>Aún no has realizado ninguna compra.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#334155', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  orderDate: { fontSize: 14, color: '#64748b' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderStatus: { fontSize: 14, color: '#334155' },
  statusValue: { fontWeight: '600', color: '#2563eb' },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#16a34a' },
});
