import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://10.10.0.186:4000/api';

export default function VerifyCodeScreen({ route, navigation }) {
  const email = route?.params?.email || '';
  const isRecovery = route?.params?.isRecovery || false;
  const registrationToken = route?.params?.registrationToken || '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length < 6) {
      Alert.alert('Error', 'Por favor ingresa el código completo de 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isRecovery) {
        navigation.navigate('ResetPassword', { email, code: verificationCode });
      } else {
        const response = await fetch(`${API_URL}/registerCustomer/verifyCodeEmail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verificationCodeRequest: verificationCode,
            registrationToken: registrationToken,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert(
            '¡Cuenta Verificada!',
            'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
            [{ text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }]
          );
        } else {
          Alert.alert('Error', data.message || 'Código inválido. Intenta de nuevo.');
        }
      }
    } catch (error) {
      console.warn('Verify error:', error);
      Alert.alert('Error', 'No se pudo verificar el código. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#2563eb" />
          <Text style={styles.backText}> Volver</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <Ionicons name="mail-open-outline" size={72} color="#2563eb" />
        </View>

        <Text style={styles.title}>Verificar Código</Text>
        <Text style={styles.subtitle}>
          Ingresa el código de 6 caracteres que enviamos a{'\n'}
          <Text style={styles.emailHighlight}>{email}</Text>
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text.slice(-1), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              maxLength={1}
              autoCapitalize="none"
              autoCorrect={false}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verificar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendSection}>
          <Text style={styles.resendText}>¿No recibiste el código? </Text>
          <TouchableOpacity onPress={() => {
            navigation.goBack();
            Alert.alert('Info', 'Vuelve a llenar el formulario y presiona Registrarse para reenviar el código.');
          }}>
            <Text style={styles.resendLink}>Reenviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 24, flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#2563eb', fontWeight: '500' },
  iconContainer: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  emailHighlight: { color: '#2563eb', fontWeight: '600' },
  codeContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 32 },
  codeInput: {
    width: 48, height: 56, borderRadius: 12, borderWidth: 2,
    borderColor: '#e2e8f0', backgroundColor: '#fff', textAlign: 'center',
    fontSize: 22, fontWeight: 'bold', color: '#1e293b', elevation: 1,
  },
  codeInputFilled: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  verifyButton: {
    backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', elevation: 2, shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  verifyButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resendSection: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  resendText: { color: '#64748b', fontSize: 14 },
  resendLink: { color: '#2563eb', fontSize: 14, fontWeight: 'bold' },
});
