import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import TransactionItem from "./TransactionItem";

export default function TransactionList({ transactions }) {
  // Renderizo cada transacción usando TransactionItem
  const renderItem = ({ item }) => <TransactionItem item={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Historial de Transacciones</Text>

      {transactions.length === 0 ? (
        <Text style={styles.noData}>No hay transacciones aún.</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noData: {
    color: "#888",
    fontStyle: "italic",
    marginTop: 10,
  },
});
