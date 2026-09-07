import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';

export default function CartScreen() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useContext(CartContext);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito Vacío', 'Agrega repuestos antes de procesar el pedido.');
      return;
    }
    Alert.alert(
      'Pedido Confirmado',
      'Tu pedido ha sido enviado al administrador. Nos pondremos en contacto pronto.',
      [{ text: 'OK', onPress: () => clearCart() }]
    );
  };

  const handleRemove = (item) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Quieres eliminar "${item.name}" del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeFromCart(item._id) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="cube-outline" size={32} color="#94a3b8" />
            </View>
          )}
        </View>

        {/* Info del producto */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.productDescription} numberOfLines={1}>{item.description}</Text>
          ) : null}
          <Text style={styles.productPrice}>${Number(item.price || 0).toFixed(2)}</Text>

          {/* Controles de cantidad */}
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
            >
              <Ionicons name="remove" size={18} color="#334155" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity || 1}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
            >
              <Ionicons name="add" size={18} color="#334155" />
            </TouchableOpacity>

            <Text style={styles.subtotalText}>
              ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Botón eliminar */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemove(item)}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Tu Carrito</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={72} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>Agrega repuestos desde el catálogo de productos.</Text>
        </View>
      ) : (
        <>
          <Text style={styles.itemCount}>
            {cartItems.reduce((c, i) => c + (i.quantity || 1), 0)} artículo(s)
          </Text>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${getCartTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Procesar Pedido</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', margin: 16, marginBottom: 4, color: '#1e293b' },
  itemCount: { fontSize: 13, color: '#64748b', marginHorizontal: 16, marginBottom: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#334155', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, overflow: 'hidden',
  },
  cardContent: { flexDirection: 'row', padding: 12 },
  imageContainer: {
    width: 80, height: 80, borderRadius: 10,
    overflow: 'hidden', backgroundColor: '#f1f5f9',
  },
  productImage: { width: '100%', height: '100%' },
  placeholderImage: {
    width: '100%', height: '100%', justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#e2e8f0',
  },
  infoContainer: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  productName: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  productDescription: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#2563eb', marginBottom: 6 },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: '#e2e8f0',
    justifyContent: 'center', alignItems: 'center',
  },
  quantityText: {
    fontSize: 16, fontWeight: 'bold', color: '#1e293b',
    marginHorizontal: 14, minWidth: 20, textAlign: 'center',
  },
  subtotalText: { fontSize: 14, fontWeight: '600', color: '#64748b', marginLeft: 'auto' },
  deleteButton: { justifyContent: 'center', alignItems: 'center', paddingLeft: 8 },
  footer: {
    padding: 16, backgroundColor: '#fff', borderTopWidth: 1,
    borderColor: '#e2e8f0', elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 6,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#334155' },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  checkoutButton: {
    backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', elevation: 2, shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
