import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default function CategoryChart({ transactions }) {
  // Yo agrupo las transacciones por categoría
  const categories = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

  const chartData = Object.keys(categories).map((key, index) => ({
    name: key,
    amount: categories[key],
    color: chartColors[index % chartColors.length],
    legendFontColor: "#fff",
    legendFontSize: 14
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Gastos por categoría</Text>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#000",
            backgroundGradientFrom: "#000",
            backgroundGradientTo: "#000",
            decimalPlaces: 0,
            color: () => "#fff",
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noData}>Aún no hay gastos registrados</Text>
      )}
    </View>
  );
}

const chartColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  noData: {
    color: "#888",
    marginTop: 10,
  },
});
