import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Text } from "react-native";
import colors from "../theme/colors";

// Componente para agregar transacciones: ingresos o gastos
export default function TransactionForm({ onAddTransaction }) {
  // Estados locales
  const [amount, setAmount] = useState(""); // monto ingresado
  const [category, setCategory] = useState(""); // categoría seleccionada
  const [type, setType] = useState("income"); // tipo: "income" o "expense"
  const [categories, setCategories] = useState({ income: [], expense: [] }); // categorías dinámicas

  // Cargo las categorías desde el JSON remoto al iniciar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/fgattidelaconcepcion/CategoriesJson/main/categorias.json"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.log("Error cargando categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  // Función que se ejecuta al presionar "Agregar"
  const handleAdd = () => {
    if (!amount || !category) {
      Alert.alert("Error", "Por favor ingresa monto y categoría");
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      type,
      amount: Math.abs(parseFloat(amount)),
      category,
      date: new Date().toLocaleDateString(),
    };

    onAddTransaction(transaction);

    // Limpio los campos para la próxima entrada
    setAmount("");
    setCategory("");
  };

  // Selecciono las categorías según el tipo
  const currentCategories = type === "income" ? categories.income : categories.expense;

  return (
    <View style={styles.container}>
      {/* Botones para cambiar tipo de transacción */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Button title="Ingreso" color={colors.income} onPress={() => setType("income")} />
        <Button title="Gasto" color={colors.expense} onPress={() => setType("expense")} />
      </View>

      {/* Campo de monto */}
      <TextInput
        placeholder="Monto"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      {/* Selector de categoría con botones */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        {currentCategories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && { backgroundColor: colors.accent },
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && { color: "#fff" }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botón para agregar transacción */}
      <Button
        title={`Agregar ${type === "income" ? "Ingreso" : "Gasto"}`}
        color={type === "income" ? colors.income : colors.expense}
        onPress={handleAdd}
      />
    </View>
  );
}

// Estilos del formulario
const styles = StyleSheet.create({
  container: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#1e1e1e",
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
  },
});
