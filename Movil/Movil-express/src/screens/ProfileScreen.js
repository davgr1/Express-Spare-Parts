import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
  Image, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://10.10.0.186:4000/api';

export default function ProfileScreen() {
  const { userData, logout, updateUser } = useContext(AuthContext);

  // Estados para modal de edición
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editUser, setEditUser] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleOpenEdit = () => {
    setEditName(userData?.full_name || userData?.name || '');
    setEditEmail(userData?.email || '');
    setEditPhone(userData?.phone_number || userData?.phone || '');
    setEditUser(userData?.user || '');
    setEditImage(userData?.image || null);
    setShowUrlInput(false);
    setUrlInput('');
    setIsEditing(true);
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la galería de fotos.');
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
        const formatted = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        setEditImage(formatted);
      }
    } catch (e) {
      console.warn('Error al seleccionar imagen:', e);
      Alert.alert('Error', 'No se pudo abrir la galería. Puedes ingresar una URL de imagen.');
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setEditImage(null);
    } else {
      setEditImage(urlInput.trim());
    }
    setShowUrlInput(false);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Error', 'El nombre y correo electrónico son obligatorios.');
      return;
    }

    setSaving(true);
    try {
      const updatedFields = {
        full_name: editName.trim(),
        name: editName.trim(),
        email: editEmail.trim(),
        phone_number: editPhone.trim(),
        phone: editPhone.trim(),
        user: editUser.trim(),
        image: editImage,
      };

      const customerId = userData?._id;

      if (customerId) {
        const response = await fetch(`${API_URL}/customer/${customerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al actualizar el cliente en el servidor.');
        }

        if (data.customer) {
          updateUser(data.customer);
        } else {
          updateUser(updatedFields);
        }
      } else {
        // Fallback local en caso de no tener ID disponible de inmediato
        updateUser(updatedFields);
      }

      Alert.alert('Éxito', 'Información de perfil actualizada correctamente.');
      setIsEditing(false);
    } catch (error) {
      console.warn('Error al guardar perfil:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar la información.');
    } finally {
      setSaving(false);
    }
  };

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

  const currentImage = userData?.image;
  const displayName = userData?.full_name || userData?.name || 'Cliente';
  const displayEmail = userData?.email || 'Sin correo registrado';
  const displayPhone = userData?.phone_number || userData?.phone || 'No registrado';
  const displayUser = userData?.user || 'No definido';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Tarjeta de Encabezado de Usuario */}
      <View style={styles.userCard}>
        <View style={styles.avatarWrapper}>
          {currentImage ? (
            <Image source={{ uri: currentImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={54} color="#94a3b8" />
            </View>
          )}
          <TouchableOpacity style={styles.editPhotoIcon} onPress={handleOpenEdit}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userHandle}>@{displayUser}</Text>
        
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark-outline" size={14} color="#16a34a" />
          <Text style={styles.badgeText}>Cliente Registrado</Text>
        </View>
      </View>

      {/* Tarjeta con los datos del Cliente */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <TouchableOpacity style={styles.editBtn} onPress={handleOpenEdit}>
            <Ionicons name="pencil-outline" size={16} color="#2563eb" style={{ marginRight: 4 }} />
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Nombre Completo */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrapper}>
            <Ionicons name="person-outline" size={20} color="#2563eb" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nombre Completo</Text>
            <Text style={styles.infoValue}>{displayName}</Text>
          </View>
        </View>

        {/* Correo Electrónico */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrapper}>
            <Ionicons name="mail-outline" size={20} color="#2563eb" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Correo Electrónico</Text>
            <Text style={styles.infoValue}>{displayEmail}</Text>
          </View>
        </View>

        {/* Teléfono */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrapper}>
            <Ionicons name="call-outline" size={20} color="#2563eb" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{displayPhone}</Text>
          </View>
        </View>

        {/* Nombre de Usuario */}
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <View style={styles.infoIconWrapper}>
            <Ionicons name="at-outline" size={20} color="#2563eb" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nombre de Usuario</Text>
            <Text style={styles.infoValue}>{displayUser}</Text>
          </View>
        </View>
      </View>

      {/* Botón Principal de Edición */}
      <TouchableOpacity style={styles.mainEditButton} onPress={handleOpenEdit}>
        <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.mainEditButtonText}>Editar Información</Text>
      </TouchableOpacity>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Modal para Editar Información */}
      <Modal visible={isEditing} animationType="slide" transparent onRequestClose={() => setIsEditing(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Información</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              {/* Foto de Perfil en el modal */}
              <View style={styles.modalAvatarContainer}>
                <TouchableOpacity style={styles.modalAvatarPicker} onPress={handlePickImage} activeOpacity={0.8}>
                  {editImage ? (
                    <Image source={{ uri: editImage }} style={styles.modalAvatarImage} />
                  ) : (
                    <View style={styles.modalAvatarPlaceholder}>
                      <Ionicons name="person-outline" size={40} color="#94a3b8" />
                    </View>
                  )}
                  <View style={styles.modalCameraBadge}>
                    <Ionicons name="camera" size={14} color="#fff" />
                  </View>
                </TouchableOpacity>

                <View style={styles.modalPhotoButtons}>
                  <TouchableOpacity style={styles.modalPhotoBtn} onPress={handlePickImage}>
                    <Ionicons name="image-outline" size={14} color="#2563eb" style={{ marginRight: 4 }} />
                    <Text style={styles.modalPhotoBtnText}>Cambiar Foto</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.modalPhotoBtn} onPress={() => setShowUrlInput(!showUrlInput)}>
                    <Ionicons name="link-outline" size={14} color="#64748b" style={{ marginRight: 4 }} />
                    <Text style={styles.modalUrlBtnText}>URL web</Text>
                  </TouchableOpacity>

                  {editImage && (
                    <TouchableOpacity style={styles.modalPhotoBtn} onPress={() => setEditImage(null)}>
                      <Ionicons name="close-circle-outline" size={14} color="#ef4444" style={{ marginRight: 4 }} />
                      <Text style={styles.modalRemoveBtnText}>Quitar</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {showUrlInput && (
                  <View style={styles.urlInputRow}>
                    <TextInput
                      style={styles.modalUrlInput}
                      placeholder="https://ejemplo.com/foto.jpg"
                      placeholderTextColor="#94a3b8"
                      value={urlInput}
                      onChangeText={setUrlInput}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.modalApplyBtn} onPress={handleApplyUrl}>
                      <Text style={styles.modalApplyBtnText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Input Nombre Completo */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre Completo *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Tu nombre completo"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Input Correo Electrónico */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correo Electrónico *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="tu@correo.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Input Teléfono */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={editPhone}
                    onChangeText={setEditPhone}
                    placeholder="Tu número de teléfono"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Input Nombre de Usuario */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre de Usuario</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="at-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={editUser}
                    onChangeText={setEditUser}
                    placeholder="Nombre de usuario"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Botones de acción modal */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.buttonDisabled]}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e2e8f0',
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  editPhotoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
  },
  editBtnText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
  },
  mainEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  mainEditButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 15,
    borderRadius: 14,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalAvatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatarPicker: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  modalAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  modalAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  modalCameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalPhotoButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  modalPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalPhotoBtnText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  modalUrlBtnText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  modalRemoveBtnText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  urlInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    gap: 8,
  },
  modalUrlInput: {
    flex: 1,
    height: 38,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#1e293b',
  },
  modalApplyBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalApplyBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  modalActions: {
    marginTop: 10,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
});
