import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'https://virtually-path-console-abstracts.trycloudflare.com/api';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { userData } = useContext(AuthContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const response = await fetch(`${API_URL}/product`);
      const data = await response.json();
      if (response.ok) {
        // Tomar algunos productos como destacados
        setFeaturedProducts(data.slice(0, 4));
      }
    } catch (error) {
      console.warn('Error al cargar inicio:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Productos')}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <Ionicons name="cube-outline" size={40} color="#94a3b8" />
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardPrice}>${Number(item.price || 0).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // Obtener el primer nombre del usuario
  const firstName = userData?.full_name ? userData.full_name.split(' ')[0] : (userData?.name || 'Cliente');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner Principal */}
      <View style={styles.banner}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.bannerImage}
          resizeMode="contain"
        />
        <Text style={styles.bannerTitle}>Hola, {firstName} 👋</Text>
        <Text style={styles.bannerSubtitle}>Encuentra los mejores repuestos en Express Spare Parts</Text>
      </View>

      {/* Categorías Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acceso Rápido</Text>
        <View style={styles.categoriesRow}>
          <TouchableOpacity style={styles.categoryItem} onPress={() => navigation.navigate('Productos')}>
            <View style={[styles.categoryIcon, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="cube" size={24} color="#2563eb" />
            </View>
            <Text style={styles.categoryText}>Catálogo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem} onPress={() => navigation.navigate('Promociones')}>
            <View style={[styles.categoryIcon, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="pricetag" size={24} color="#ef4444" />
            </View>
            <Text style={styles.categoryText}>Ofertas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem} onPress={() => navigation.navigate('Perfil')}>
            <View style={[styles.categoryIcon, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="person" size={24} color="#16a34a" />
            </View>
            <Text style={styles.categoryText}>Mi Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Productos Destacados */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Productos Destacados</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Productos')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>
      
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  banner: { 
    backgroundColor: '#1e3d8a', 
    padding: 30, 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20
  },
  bannerImage: { width: 100, height: 100, marginBottom: 15, tintColor: '#fff' },
  bannerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  bannerSubtitle: { fontSize: 14, color: '#e2e8f0', textAlign: 'center' },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  seeAllText: { fontSize: 14, color: '#2563eb', fontWeight: '600' },
  categoriesRow: { flexDirection: 'row', justifyContent: 'space-around' },
  categoryItem: { alignItems: 'center' },
  categoryIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  featuredList: { paddingRight: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, width: 140, marginRight: 15,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, overflow: 'hidden'
  },
  imageContainer: { height: 100, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  cardInfo: { padding: 10 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: '#2563eb' }
});
