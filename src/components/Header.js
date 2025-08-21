import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

// Este componente lo uso como encabezado de la app.
// Muestra el título y el balance mensual.
export default function Header({ balance }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Mi Control de Gastos</Text>
      <Text style={styles.balance}>Balance: ${balance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.accent,
  },
  balance: {
    fontSize: 18,
    marginTop: 8,
    color: colors.text,
  },
});
