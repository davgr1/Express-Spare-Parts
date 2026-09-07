import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://10.10.0.186:4000/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a las fotos de tu dispositivo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const formattedUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        setImage(formattedUri);
      }
    } catch (err) {
      console.warn('Error seleccionando imagen:', err);
      Alert.alert('Error', 'No se pudo abrir la galería. Puedes ingresar una URL de imagen directamente.');
    }
  };

  const handleApplyUrl = () => {
    if (!imageUrlInput.trim()) {
      setImage(null);
    } else {
      setImage(imageUrlInput.trim());
    }
    setShowUrlInput(false);
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/registerCustomer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          full_name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          phone_number: phone.trim(),
          user: user.trim() || name.trim(),
          image: image || null,
          password,
          status: true,
          isVerified: false,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresVerification) {
          const regToken = data.registrationToken;
          Alert.alert(
            'Código Enviado',
            'Se ha enviado un código de verificación a tu correo electrónico.',
            [{
              text: 'OK',
              onPress: () => navigation.navigate('VerifyCode', {
                email: email.trim(),
                registrationToken: regToken,
              })
            }]
          );
        } else {
          Alert.alert(
            '¡Cuenta Creada!',
            data.message || 'Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión.',
            [{ text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }]
          );
        }
      } else {
        Alert.alert('Error', data.message || 'Error al registrarse.');
      }
    } catch (error) {
      console.warn('Register error:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#2563eb" />
            <Text style={styles.backText}> Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a Express Spare Parts</Text>
        </View>

        {/* Sección de Foto de Perfil */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarPicker} onPress={pickImage} activeOpacity={0.8}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person-outline" size={44} color="#94a3b8" />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.photoActions}>
            <TouchableOpacity onPress={pickImage} style={styles.photoBtn}>
              <Ionicons name="image-outline" size={16} color="#2563eb" style={{ marginRight: 4 }} />
              <Text style={styles.photoBtnText}>{image ? 'Cambiar Foto' : 'Subir Foto de Perfil'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowUrlInput(!showUrlInput)} style={styles.photoBtn}>
              <Ionicons name="link-outline" size={16} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.urlBtnText}>URL web</Text>
            </TouchableOpacity>

            {image && (
              <TouchableOpacity onPress={() => setImage(null)} style={styles.photoBtn}>
                <Ionicons name="close-circle-outline" size={16} color="#ef4444" style={{ marginRight: 4 }} />
                <Text style={styles.removePhotoText}>Quitar</Text>
              </TouchableOpacity>
            )}
          </View>

          {showUrlInput && (
            <View style={styles.urlInputContainer}>
              <TextInput
                style={styles.urlInput}
                placeholder="https://ejemplo.com/mifoto.jpg"
                placeholderTextColor="#94a3b8"
                value={imageUrlInput}
                onChangeText={setImageUrlInput}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.urlApplyBtn} onPress={handleApplyUrl}>
                <Text style={styles.urlApplyBtnText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Tu nombre completo"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="tu@correo.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Tu número de teléfono"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de Usuario</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="at-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario (opcional)"
                placeholderTextColor="#999"
                value={user}
                onChangeText={setUser}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}> Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { flexGrow: 1, padding: 24 },
  headerSection: { marginBottom: 24, marginTop: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 16, color: '#2563eb', fontWeight: '500' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b' },
  formSection: { marginBottom: 24 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0',
    paddingHorizontal: 12, height: 50, elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1e293b' },
  registerButton: {
    backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 8, elevation: 2,
    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  registerButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footerSection: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 24 },
  footerText: { color: '#64748b', fontSize: 14 },
  loginLink: { color: '#2563eb', fontSize: 14, fontWeight: 'bold' },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPicker: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e2e8f0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  photoBtnText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  urlBtnText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  removePhotoText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  urlInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#1e293b',
  },
  urlApplyBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urlApplyBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
