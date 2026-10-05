import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WompiWidget from '../components/WompiWidget';
import { useWompiPayment } from '../hooks/useWompiPayment';

export default function WompiPaymentScreen({ route, navigation }) {
  const { amount, reference, onPaymentSuccess } = route.params;
  const { generatePaymentLink, paymentUrl, isLoading, error, resetPayment } = useWompiPayment();

  useEffect(() => {
    // Generar el link de pago al entrar a la pantalla
    generatePaymentLink(amount, reference);

    return () => {
      resetPayment();
    };
  }, [amount, reference, generatePaymentLink, resetPayment]);

  const handleSuccess = (url) => {
    Alert.alert('Pago Exitoso', 'Tu transacción con Wompi ha sido aprobada.');
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
    navigation.goBack();
  };

  const handleCancel = () => {
    Alert.alert('Pago Cancelado', 'Has cancelado el pago.');
    navigation.goBack();
  };

  const handleError = () => {
    Alert.alert('Error', 'Ocurrió un problema al cargar la pasarela de pagos.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagar con Wompi</Text>
        <View style={{ width: 24 }} />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => generatePaymentLink(amount, reference)}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.widgetContainer}>
          <WompiWidget
            paymentUrl={paymentUrl}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onError={handleError}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  widgetContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
