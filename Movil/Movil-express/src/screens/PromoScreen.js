import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';

const API_URL = 'http://10.10.0.186:4000/api/promocion';

const MOCK_PROMOS = [
  { _id: 'p1', titulo: '2x1 en Aceites', descripcion: 'Lleva dos litros de aceite sintético por el precio de uno.', status: true, imagen: 'https://via.placeholder.com/300x150?text=Promo+Aceite' },
  { _id: 'p2', titulo: 'Descuento Llantas', descripcion: '20% de descuento en cambio de 4 llantas.', status: true, imagen: 'https://via.placeholder.com/300x150?text=Promo+Llantas' },
];

export default function PromoScreen() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await fetch(API_URL);
      const text = await response.text();
      
      if (text.startsWith('<')) throw new Error('Respuesta inválida del servidor (HTML)');
      
      const data = JSON.parse(text);
      const activePromos = Array.isArray(data) ? data.filter(p => p.status) : [];
      setPromos(activePromos.length > 0 ? activePromos : MOCK_PROMOS);
      setIsOfflineMode(false);
    } catch (error) {
      console.warn('Usando promociones de prueba. Error:', error.message);
      setPromos(MOCK_PROMOS);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <ProductCard 
      title={item.titulo}
      price={item.descripcion} // Usamos el campo de precio para mostrar la info de la promo
      imageUrl={item.imagen}
      isPromo={true}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{marginTop: 10}}>Buscando ofertas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Promociones Exclusivas</Text>
      {isOfflineMode && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#b91c1c" style={{ marginRight: 6 }} />
          <Text style={styles.offlineText}>Modo Offline: Mostrando datos de prueba</Text>
        </View>
      )}
      {promos.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No hay promociones activas por ahora.</Text>
        </View>
      ) : (
        <FlatList 
          data={promos}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', margin: 16, color: '#2563eb' },
  offlineBanner: {
    backgroundColor: '#fee2e2',
    padding: 10,
    marginHorizontal: 16,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: { color: '#b91c1c', textAlign: 'center', fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: '#666' },
  list: { padding: 16, paddingTop: 0 },
});
