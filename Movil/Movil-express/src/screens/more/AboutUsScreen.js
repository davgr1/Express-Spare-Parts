import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutUsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Institucional */}
      <View style={styles.headerCard}>
        <View style={styles.headerIconCircle}>
          <Ionicons name="business" size={32} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>Conoce Nuestra Empresa</Text>
        <Text style={styles.headerSubtitle}>Express Spare Parts</Text>
      </View>

      {/* Tarjeta: ¿Quiénes Somos? */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="information-circle-outline" size={22} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>¿Quiénes Somos?</Text>
        </View>
        <Text style={styles.cardParagraph}>
          Express Spare Parts es una empresa dedicada a la distribución y venta de repuestos internos de vehículos.
          La empresa opera mediante una plataforma digital propia que integra un sistema de comercio electrónico,
          permitiendo a los usuarios gestionar sus adquisiciones de manera remota con una disponibilidad de servicio
          de 24 horas.
        </Text>
        <Text style={[styles.cardParagraph, { marginTop: 10 }]}>
          El modelo de negocio se fundamenta en la optimización de la logística de última milla, ofreciendo un
          servicio de entrega a domicilio que pone en esencia la entrega oportuna y segura de pedidos.
        </Text>
      </View>

      {/* Tarjeta: Misión */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="rocket-outline" size={22} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>Misión</Text>
        </View>
        <Text style={styles.cardParagraph}>
          Express Spare Parts busca ser la empresa líder en ofrecer productos de repuestos para carros en la región,
          haciéndonos denotar por la rapidez y la calidad en la que brindamos nuestros productos a nuestros clientes.
        </Text>
        <Text style={[styles.cardParagraph, { marginTop: 10 }]}>
          No buscamos ser una distribuidora de repuestos más, sino la mejor opción para personas en situación de
          emergencia que busquen reemplazar partes en mal estado de sus vehículos.
        </Text>
      </View>

      {/* Tarjeta: Objetivo */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="flag-outline" size={22} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>Objetivo</Text>
        </View>
        <Text style={styles.cardParagraph}>
          Nuestra plataforma revoluciona la adquisición de repuestos al fusionar la agilidad del comercio electrónico
          con la precisión de la asistencia humana local.
        </Text>
        <Text style={[styles.cardParagraph, { marginTop: 10 }]}>
          Resolvemos la urgencia de quienes enfrentan una avería mecánica conectándolos con un inventario global y
          distribuidores estratégicos, pero con el respaldo vital de nuestros expertos en terreno que eliminan la
          incertidumbre técnica validando cada compatibilidad en tiempo real.
        </Text>
      </View>

      {/* Tarjeta: Visión */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="eye-outline" size={22} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>Visión</Text>
        </View>
        <Text style={styles.cardParagraph}>
          Ser la empresa líder y referente en la región en repuestos para vehículos, reconocida por nuestra rapidez,
          calidad y confiabilidad.
        </Text>
        <Text style={[styles.cardParagraph, { marginTop: 10 }]}>
          Buscamos convertirnos en la primera y mejor opción para clientes que enfrentan emergencias, garantizando
          soluciones inmediatas que mantengan sus vehículos en óptimas condiciones y les permitan continuar su camino
          con seguridad y tranquilidad.
        </Text>
      </View>

      {/* Tarjeta: Nuestra Historia */}
      <View style={[styles.card, styles.historyCard]}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="time-outline" size={22} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>Nuestra Historia</Text>
        </View>
        <Text style={styles.cardParagraph}>
          Durante inicios de 2026, nos reunimos como grupo de desarrolladores de software y tuvimos la idea de desarrollar
          Express Spare Parts como una empresa de venta de partes vehiculares regional en pequeña escala donde brindábamos
          nuestros servicios a través de un sitio web.
        </Text>
        <Text style={[styles.cardParagraph, { marginTop: 10 }]}>
          Tras meses de esfuerzo pusimos en marcha una pequeña sucursal en San Salvador, manteniendo siempre el enfoque
          de entrega express de calidad.
        </Text>
        <Text style={[styles.cardParagraph, { marginTop: 10 }]}>
          Con el tiempo inauguramos nuestra segunda sucursal en La Libertad a finales de 2027, abarcando todo El Salvador,
          con actuales planes de expansión hacia Centroamérica y el Caribe, siendo Guatemala nuestra próxima meta.
        </Text>
      </View>
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
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#1e3d8a',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#1e3d8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  headerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#93c5fd',
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cardParagraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    textAlign: 'justify',
  },
  historyCard: {
    borderLeftColor: '#0d9488',
  },
});
