import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const WompiWidget = ({ paymentUrl, onSuccess, onCancel, onError }) => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    console.log("Navegando a: ", url);

    // En Wompi, generalmente la URL cambia cuando termina el flujo.
    // Dependiendo de tu configuración en Wompi de la URL de redirección (redirection_url),
    // podemos capturarla aquí. Simularemos una verificación si la URL contiene "?id=" que indica éxito.
    
    // Si tienes una redirection_url configurada (e.g. mi-app://wompi-success)
    if (url.includes('id=') && url.includes('env=test')) {
      // Transacción exitosa simulada o real detectada por query params
      onSuccess(url);
    } else if (url.includes('cancel') || url.includes('error')) {
      onCancel();
    }
  };

  if (!paymentUrl) {
    return (
      <View style={styles.center}>
        <Text>URL de pago no válida</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Cargando pasarela de Wompi...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => onError()}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
});

export default WompiWidget;
