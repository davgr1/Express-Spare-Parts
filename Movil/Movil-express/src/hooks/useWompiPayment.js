import { useState, useCallback } from 'react';

export const useWompiPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [error, setError] = useState(null);

  // Esta función simula la llamada al backend para obtener el link de pago o generar los datos del widget.
  // En un entorno real, aquí harías un fetch a tu API para crear la transacción en Wompi y obtener la URL.
  const generatePaymentLink = useCallback(async (amount, reference) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simular retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Construir una URL de prueba para el Checkout de Wompi (usando la versión de Colombia como ejemplo de widget de prueba).
      // En El Salvador, Wompi ofrece el link de pago que normalmente es generado por el backend.
      // Aquí estamos simulando la carga de un entorno de prueba funcional (sandbox).
      // Reemplaza "pub_test_XXXX" con tu llave pública de prueba real de Wompi.
      const publicKey = "pub_test_X0zDA9ooKDEQTG4xFd29R7P4nuk11QZ3"; // llave pública de prueba estándar
      const currency = "USD"; // o COP, dependiendo de tu región
      const amountInCents = amount * 100;
      
      const url = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=${currency}&amount-in-cents=${amountInCents}&reference=${reference}`;
      
      setPaymentUrl(url);
      return url;
    } catch (err) {
      setError(err.message || 'Error al generar el link de pago de Wompi');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPayment = useCallback(() => {
    setPaymentUrl(null);
    setError(null);
  }, []);

  return {
    generatePaymentLink,
    paymentUrl,
    isLoading,
    error,
    resetPayment
  };
};
