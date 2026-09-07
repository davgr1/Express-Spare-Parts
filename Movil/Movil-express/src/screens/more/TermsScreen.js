import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
  const [activeSection, setActiveSection] = useState('terminos'); // 'terminos', 'privacidad', 'devoluciones'

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Ionicons name="shield-checkmark" size={32} color="#fff" style={{ marginBottom: 8 }} />
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <Text style={styles.headerSubtitle}>Express Spare Parts</Text>
      </View>

      {/* Selector de pestañas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeSection === 'terminos' && styles.tabBtnActive]}
          onPress={() => setActiveSection('terminos')}
        >
          <Text style={[styles.tabBtnText, activeSection === 'terminos' && styles.tabBtnTextActive]}>
            Términos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeSection === 'privacidad' && styles.tabBtnActive]}
          onPress={() => setActiveSection('privacidad')}
        >
          <Text style={[styles.tabBtnText, activeSection === 'privacidad' && styles.tabBtnTextActive]}>
            Privacidad
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeSection === 'devoluciones' && styles.tabBtnActive]}
          onPress={() => setActiveSection('devoluciones')}
        >
          <Text style={[styles.tabBtnText, activeSection === 'devoluciones' && styles.tabBtnTextActive]}>
            Devoluciones
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN 1: TÉRMINOS Y CONDICIONES */}
      {activeSection === 'terminos' && (
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>1. Términos y Condiciones Generales</Text>

          <Text style={styles.itemTitle}>1. Introducción</Text>
          <Text style={styles.itemBody}>
            Bienvenido a Express Spare Parts. Al acceder y utilizar nuestro sitio web, aplicación o cualquier plataforma digital asociada a la empresa, el usuario acepta cumplir con los presentes Términos y Condiciones. Si el usuario no está de acuerdo con estos términos, deberá abstenerse de utilizar nuestros servicios.
          </Text>
          <Text style={[styles.itemBody, { marginTop: 6 }]}>
            Express Spare Parts se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor una vez publicados en la plataforma.
          </Text>

          <Text style={styles.itemTitle}>2. Descripción del Servicio</Text>
          <Text style={styles.itemBody}>
            Express Spare Parts es una empresa dedicada a la venta y distribución de repuestos internos para vehículos, ofreciendo una plataforma digital disponible las 24 horas para realizar pedidos.
          </Text>
          <Text style={styles.bulletItem}>• Venta de repuestos internos de vehículos.</Text>
          <Text style={styles.bulletItem}>• Identificación de piezas mediante consulta digital.</Text>
          <Text style={styles.bulletItem}>• Entrega a domicilio rápida y confiable.</Text>
          <Text style={styles.bulletItem}>• Atención especializada para particulares y talleres mecánicos.</Text>
          <Text style={[styles.itemBody, { marginTop: 6 }]}>
            El objetivo principal del servicio es ofrecer soluciones inmediatas ante emergencias mecánicas.
          </Text>

          <Text style={styles.itemTitle}>3. Registro y Uso de la Plataforma</Text>
          <Text style={styles.itemBody}>
            Para realizar compras, el usuario puede crear una cuenta o proporcionar sus datos básicos. El usuario se compromete a proporcionar información verídica y no realizar actividades fraudulentas. Express Spare Parts podrá suspender o cancelar cuentas que incumplan estas normas.
          </Text>

          <Text style={styles.itemTitle}>4. Precios y Pagos</Text>
          <Text style={styles.itemBody}>
            Todos los precios mostrados están expresados en dólares estadounidenses (USD). Se aceptan tarjetas de débito/crédito y transferencias. La empresa se reserva el derecho de modificar precios sin previo aviso.
          </Text>

          <Text style={styles.itemTitle}>5. Confirmación de Pedidos</Text>
          <Text style={styles.itemBody}>
            Un pedido se considera confirmado tras completar la compra, validar el pago y emitir la confirmación correspondiente. La empresa podrá cancelar pedidos por falta de inventario, errores de precio o sospecha de fraude.
          </Text>

          <Text style={styles.itemTitle}>6. Entregas</Text>
          <Text style={styles.itemBody}>
            Ofrecemos servicio prioritario a domicilio. Los tiempos pueden variar según ubicación geográfica. El cliente debe brindar una dirección clara y exacta.
          </Text>

          <Text style={styles.itemTitle}>7. Garantía de Productos</Text>
          <Text style={styles.itemBody}>
            Todos los repuestos cuentan con garantía contra defectos de fábrica. No aplica por mala instalación, uso indebido o manipulación de la pieza.
          </Text>

          <Text style={styles.itemTitle}>8. Responsabilidad</Text>
          <Text style={styles.itemBody}>
            Express Spare Parts no se responsabiliza por daños derivados de una instalación incorrecta o fallas mecánicas ajenas al repuesto adquirido.
          </Text>

          <Text style={styles.itemTitle}>9. Propiedad Intelectual</Text>
          <Text style={styles.itemBody}>
            Logos, marcas, textos y fotografías son propiedad exclusiva de Express Spare Parts y se encuentran protegidos por las leyes de propiedad intelectual.
          </Text>

          <Text style={styles.itemTitle}>10. Contacto</Text>
          <Text style={styles.itemBody}>
            Para consultas o soporte, escribe a express_spare_parts@gmail.com o comunícate al 6245-1425.
          </Text>
        </View>
      )}

      {/* SECCIÓN 2: POLÍTICA DE PRIVACIDAD */}
      {activeSection === 'privacidad' && (
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>2. Política de Privacidad</Text>

          <Text style={styles.itemTitle}>1. Compromiso de Seguridad</Text>
          <Text style={styles.itemBody}>
            Express Spare Parts se compromete a proteger la privacidad y seguridad de la información personal de sus usuarios conforme a los más altos estándares.
          </Text>

          <Text style={styles.itemTitle}>2. Información que Recopilamos</Text>
          <Text style={styles.bulletItem}>• Nombre completo y nombre de usuario.</Text>
          <Text style={styles.bulletItem}>• Correo electrónico y teléfono de contacto.</Text>
          <Text style={styles.bulletItem}>• Dirección para coordinación de entrega de repuestos.</Text>
          <Text style={styles.bulletItem}>• Foto de perfil (opcional).</Text>
          <Text style={styles.bulletItem}>• Datos del vehículo para validación de compatibilidad.</Text>

          <Text style={styles.itemTitle}>3. Uso de la Información</Text>
          <Text style={styles.itemBody}>
            La información se utiliza estrictamente para procesar compras, coordinar entregas express, brindar soporte técnico y enviar notificaciones de estado de pedidos.
          </Text>

          <Text style={styles.itemTitle}>4. Protección y No Compartición</Text>
          <Text style={styles.itemBody}>
            Express Spare Parts no vende ni comparte tus datos personales con terceros para fines publicitarios. Los datos solo se emplean operativamente para la facturación y la logística de entrega.
          </Text>

          <Text style={styles.itemTitle}>5. Derechos del Usuario</Text>
          <Text style={styles.itemBody}>
            Tienes derecho a acceder, actualizar, corregir o eliminar tus datos personales en cualquier momento desde el apartado de Perfil de la aplicación.
          </Text>
        </View>
      )}

      {/* SECCIÓN 3: POLÍTICA DE DEVOLUCIONES */}
      {activeSection === 'devoluciones' && (
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>3. Política de Devoluciones y Reembolsos</Text>

          <Text style={styles.itemTitle}>1. Plazo para Devoluciones</Text>
          <Text style={styles.itemBody}>
            Los clientes pueden solicitar una devolución dentro de los 7 días posteriores a la recepción del repuesto adquirido.
          </Text>

          <Text style={styles.itemTitle}>2. Condiciones para Aceptación</Text>
          <Text style={styles.bulletItem}>• El producto debe encontrarse en perfecto estado estético y funcional.</Text>
          <Text style={styles.bulletItem}>• Conservar el empaque y sellos originales de fábrica.</Text>
          <Text style={styles.bulletItem}>• No haber sido instalado o forzado mecánicamente.</Text>
          <Text style={styles.bulletItem}>• Presentar comprobante digital o número de pedido.</Text>

          <Text style={styles.itemTitle}>3. Productos No Elegibles</Text>
          <Text style={styles.itemBody}>
            No se aceptan devoluciones en componentes eléctricos dañados por sobretensión, repuestos usados o piezas manipuladas indebidamente por terceros.
          </Text>

          <Text style={styles.itemTitle}>4. Proceso de Reembolso</Text>
          <Text style={styles.itemBody}>
            Aprobada la revisión técnica, el cliente podrá solicitar el reemplazo inmediato por otra pieza compatible o el reembolso de su dinero en un plazo de 3 a 10 días hábiles.
          </Text>
        </View>
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
  headerCard: {
    backgroundColor: '#1e3d8a',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#1e3d8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#93c5fd',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabBtnActive: {
    backgroundColor: '#1e3d8a',
    borderColor: '#1e3d8a',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e3d8a',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 4,
  },
  itemBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'justify',
  },
  bulletItem: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginLeft: 8,
    marginTop: 2,
  },
});
