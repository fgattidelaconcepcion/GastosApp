import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BalanceCard({ balance }) {
  // Muestro el balance actual en una tarjeta elegante
  return (
    <View style={styles.card}>
      <Text style={styles.label}>💰 Balance Mensual</Text>
      <Text style={[styles.amount, balance >= 0 ? styles.positive : styles.negative]}>
        ${balance.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e1e", // tarjeta gris oscuro para contraste con fondo negro
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, // sombra para Android
  },
  label: {
    color: "#bbb", // gris claro
    fontSize: 16,
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  positive: {
    color: "#4cd964", // verde ingresos
  },
  negative: {
    color: "#ff3b30", // rojo egresos
  },
});
