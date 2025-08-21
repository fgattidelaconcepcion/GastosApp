import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function TransactionItem({ item }) {
  // Determino si es ingreso para colorear correctamente
  const isIncome = item.type === "income";

  return (
    <View style={styles.container}>
      {/* Muestro la categoría de la transacción */}
      <Text style={styles.category}>{item.category}</Text>

      {/* Monto, con + o - según tipo */}
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? "+" : "-"} ${item.amount.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: colors.card, // fondo de la tarjeta
    borderRadius: 10,
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: colors.text, // texto destacado
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
