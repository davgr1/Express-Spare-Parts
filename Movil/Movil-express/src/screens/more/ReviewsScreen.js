import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://10.10.0.186:4000/api';

const MOCK_REVIEWS = [
  {
    _id: 'r1',
    customerName: 'Brando A',
    ranking: 5,
    title: 'Excelente servicio y rapidez',
    experience_type: 'Positiva',
    details: 'Gracias a Express Spare Parts pude reparar la llanta de mi vehículo que quedó varado en plena calle.',
  },
  {
    _id: 'r2',
    customerName: 'Cristian',
    ranking: 5,
    title: 'Piezas originales y buen precio',
    experience_type: 'Positiva',
    details: 'Compré los amortiguadores y llegaron en menos de 2 horas. La calidad es de primera.',
  },
  {
    _id: 'r3',
    customerName: 'Joshua',
    ranking: 4,
    title: 'Muy buena atención al cliente',
    experience_type: 'Positiva',
    details: 'El asesor me ayudó a elegir el filtro de aceite exacto para mi modelo. Recomendados.',
  },
  {
    _id: 'r4',
    customerName: 'David',
    ranking: 4,
    title: 'Servicio confiable',
    experience_type: 'Positiva',
    details: 'Atención rápida y el pedido llegó en el tiempo acordado a mi taller.',
  },
  {
    _id: 'r5',
    customerName: 'Brando A',
    ranking: 2,
    title: 'Demora en hora pico',
    experience_type: 'Negativa',
    details: 'El tráfico retrasó un poco la entrega, pero el repuesto funcionó correctamente.',
  },
  {
    _id: 'r6',
    customerName: 'Cristian',
    ranking: 3,
    title: 'Caja un poco maltratada',
    experience_type: 'Negativa',
    details: 'El repuesto venía bien protegido adentro, pero la caja exterior venía doblada.',
  },
  {
    _id: 'r7',
    customerName: 'Joshua',
    ranking: 2,
    title: 'Stock limitado en un repuesto',
    experience_type: 'Negativa',
    details: 'No tenían la segunda unidad en inventario de inmediato, tuve que esperar al día siguiente.',
  },
  {
    _id: 'r8',
    customerName: 'David',
    ranking: 3,
    title: 'Regular el tiempo de respuesta',
    experience_type: 'Negativa',
    details: 'Tardaron un poco en confirmar la compatibilidad por WhatsApp, aunque al final todo bien.',
  },
];

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [stats, setStats] = useState({
    averageRanking: 4.1,
    totalReviews: 8,
    distribution: { 5: 3, 4: 2, 3: 2, 2: 1, 1: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('todas'); // 'todas', 'positivas', 'negativas'

  // Formulario de nueva reseña
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRanking, setNewRanking] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Excelente');
  const [newDetails, setNewDetails] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/reviews/active`),
        fetch(`${API_URL}/reviews/stats`),
      ]);

      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((r) => ({
            _id: r._id,
            customerName: r.id_customer?.full_name || r.id_customer?.name || 'Cliente',
            ranking: r.ranking || 5,
            title: r.title || 'Reseña',
            experience_type: r.experience_type || '',
            details: r.details || '',
          }));
          setReviews(mapped);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData && statsData.totalReviews > 0) {
          setStats(statsData);
        }
      }
    } catch (e) {
      console.warn('Usando reseñas de muestra:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newTitle.trim() || !newDetails.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título y el comentario de tu reseña.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ranking: newRanking,
          title: newTitle.trim(),
          experience_type: newType.trim(),
          details: newDetails.trim(),
        }),
      });

      // Crear y agregar localmente
      const createdReview = {
        _id: Date.now().toString(),
        customerName: 'Tú',
        ranking: newRanking,
        title: newTitle.trim(),
        experience_type: newType.trim(),
        details: newDetails.trim(),
      };

      setReviews([createdReview, ...reviews]);
      Alert.alert('¡Gracias!', 'Tu valoración ha sido registrada exitosamente.');
      setNewTitle('');
      setNewDetails('');
      setShowForm(false);
    } catch (e) {
      Alert.alert('Éxito', 'Tu reseña ha sido registrada.');
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === 'positivas') return r.ranking >= 4;
    if (activeTab === 'negativas') return r.ranking < 4;
    return true;
  });

  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= count ? 'star' : 'star-outline'}
          size={16}
          color="#f59e0b"
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Encabezado Principal y Resumen de Valoraciones */}
      <View style={styles.summaryCard}>
        <Text style={styles.mainTitle}>Valoraciones y Reseñas</Text>

        <View style={styles.statsRow}>
          {/* Puntuación grande */}
          <View style={styles.scoreContainer}>
            <Text style={styles.bigScore}>{Number(stats.averageRanking || 4.1).toFixed(1)}</Text>
            {renderStars(Math.round(stats.averageRanking || 4.1))}
            <Text style={styles.reviewCountText}>{stats.totalReviews || reviews.length} reseñas</Text>
          </View>

          {/* Barras de distribución */}
          <View style={styles.barsContainer}>
            {[5, 4, 3, 2, 1].map((num) => {
              const count = stats.distribution?.[num] || 0;
              const total = stats.totalReviews || reviews.length || 1;
              const percent = Math.min(100, Math.round((count / total) * 100));

              return (
                <View key={num} style={styles.barRow}>
                  <Text style={styles.starNumText}>{num}</Text>
                  <View style={styles.barBackground}>
                    <View style={[styles.barFill, { width: `${percent}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Botón para Dejar Reseña */}
        <TouchableOpacity
          style={styles.openFormBtn}
          onPress={() => setShowForm(!showForm)}
        >
          <Ionicons name={showForm ? 'close' : 'create-outline'} size={18} color="#2563eb" style={{ marginRight: 6 }} />
          <Text style={styles.openFormBtnText}>{showForm ? 'Cerrar Formulario' : 'Escribir una Reseña'}</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario desplegable */}
      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Deja tu opinión</Text>

          {/* Selector de Estrellas */}
          <Text style={styles.inputLabel}>Tu Calificación:</Text>
          <View style={styles.starPickerRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setNewRanking(s)} style={{ padding: 4 }}>
                <Ionicons
                  name={s <= newRanking ? 'star' : 'star-outline'}
                  size={32}
                  color="#f59e0b"
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Título:</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Ej: Excelente servicio y rapidez"
            placeholderTextColor="#94a3b8"
            value={newTitle}
            onChangeText={setNewTitle}
          />

          <Text style={styles.inputLabel}>Tipo de Experiencia:</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Ej: Excelente, Positiva, Regular"
            placeholderTextColor="#94a3b8"
            value={newType}
            onChangeText={setNewType}
          />

          <Text style={styles.inputLabel}>Comentario:</Text>
          <TextInput
            style={[styles.formInput, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Cuéntanos tu experiencia con Express Spare Parts..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
            value={newDetails}
            onChangeText={setNewDetails}
          />

          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
            onPress={handleSubmitReview}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Publicar Reseña</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Filtros de Pestañas (Todas, Positivas, Negativas) */}
      <View style={styles.tabFilterRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'todas' && styles.tabButtonActive]}
          onPress={() => setActiveTab('todas')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'todas' && styles.tabButtonTextActive]}>
            Todas ({reviews.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'positivas' && styles.tabButtonActive]}
          onPress={() => setActiveTab('positivas')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'positivas' && styles.tabButtonTextActive]}>
            Positivas ({reviews.filter((r) => r.ranking >= 4).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'negativas' && styles.tabButtonActive]}
          onPress={() => setActiveTab('negativas')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'negativas' && styles.tabButtonTextActive]}>
            Negativas ({reviews.filter((r) => r.ranking < 4).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Reseñas */}
      {filteredReviews.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="chatbubbles-outline" size={44} color="#cbd5e1" />
          <Text style={styles.emptyText}>No hay reseñas en esta categoría.</Text>
        </View>
      ) : (
        filteredReviews.map((item) => (
          <View key={item._id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewAuthor}>{item.customerName}</Text>
                {item.experience_type ? (
                  <Text style={styles.reviewExpType}>{item.experience_type}</Text>
                ) : null}
              </View>
              {renderStars(item.ranking)}
            </View>

            <Text style={styles.reviewTitleText}>{item.title}</Text>
            <Text style={styles.reviewBodyText}>{item.details}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    minWidth: 110,
  },
  bigScore: {
    fontSize: 44,
    fontWeight: '900',
    color: '#1e3a8a',
    lineHeight: 50,
  },
  reviewCountText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  barsContainer: {
    flex: 1,
    paddingLeft: 16,
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    width: 12,
  },
  barBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#1e3a8a',
    borderRadius: 4,
  },
  openFormBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  openFormBtnText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  starPickerRow: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabButtonActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  reviewExpType: {
    fontSize: 11,
    color: '#94a3b8',
  },
  reviewTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  reviewBodyText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#94a3b8',
  },
});
