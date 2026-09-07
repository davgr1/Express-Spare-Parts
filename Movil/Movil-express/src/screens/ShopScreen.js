import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import CustomButton from '../components/CustomButton';

const API_URL = 'http://10.10.0.186:4000/api/product';

const MOCK_PRODUCTS = [
  { _id: '1', name: 'Amortiguador Delantero', description: 'Amortiguador de gas premium', price: 45.99, stock: 25, image: 'https://via.placeholder.com/150' },
  { _id: '2', name: 'Pastillas de Freno', description: 'Pastillas de cerámica', price: 25.50, stock: 10, image: 'https://via.placeholder.com/150' },
  { _id: '3', name: 'Filtro de Aceite', description: 'Filtro de alto rendimiento', price: 8.99, stock: 50, image: 'https://via.placeholder.com/150' },
  { _id: '4', name: 'Batería 12V', description: 'Batería de larga duración', price: 89.99, stock: 5, image: 'https://via.placeholder.com/150' },
];

export default function ShopScreen() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(API_URL);
      const text = await response.text();
      // Si la respuesta es HTML (p. ej. error 500 del backend), forzamos el catch
      if (text.startsWith('<')) throw new Error('Respuesta inválida del servidor (HTML)');
      
      const data = JSON.parse(text);
      setProductos(Array.isArray(data) && data.length > 0 ? data : MOCK_PRODUCTS);
      setIsOfflineMode(false);
    } catch (error) {
      console.warn('Usando datos de prueba. Error:', error.message);
      setProductos(MOCK_PRODUCTS);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <ProductCard 
        title={item.name}
        price={item.price}
        imageUrl={item.image}
      />
      <CustomButton 
        title="Agregar al Carrito" 
        onPress={() => {
          const success = addToCart(item);
          if (success) {
            Alert.alert('Agregado', `${item.name} se agregó al carrito`);
          }
        }}
        style={styles.addButton}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{marginTop: 10}}>Cargando catálogo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Productos</Text>
      {isOfflineMode && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#b91c1c" style={{ marginRight: 6 }} />
          <Text style={styles.offlineText}>Modo Offline: Mostrando datos de prueba</Text>
        </View>
      )}
      <FlatList 
        data={productos}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', margin: 16, color: '#1f2937' },
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
  list: { padding: 16, paddingTop: 0 },
  cardWrapper: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButton: {
    marginTop: -10,
    marginHorizontal: 10,
    marginBottom: 10,
  }
});
