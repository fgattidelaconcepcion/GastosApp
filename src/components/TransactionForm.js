import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text } from "react-native";
import colors from "../theme/colors";
import { Picker } from "@react-native-picker/picker";

export default function TransactionForm({ onAddTransaction }) {
  // Mantengo el monto, la categoría seleccionada y el tipo (ingreso/gasto)
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("income"); // inicio con "income" por defecto

  // Categorías predefinidas para ingresos y egresos
  const incomeCategories = ["Sueldo", "Bonos", "Otros"];
  const expenseCategories = ["Gimnasio","Internet","Celular", "Luz", "Agua", "Alquiler", "Otros"];

  // Función que se ejecuta al presionar "Agregar"
  const handleAdd = () => {
    // Validación básica
    if (!amount || !category) {
      Alert.alert("Error", "Por favor ingresa monto y categoría");
      return;
    }

    // Creo un objeto transacción estándar
    const transaction = {
      id: Date.now().toString(), // id único
      type,                       // "income" o "expense"
      amount: Math.abs(parseFloat(amount)), // monto siempre positivo
      category,                   // categoría seleccionada
      date: new Date().toLocaleDateString(), // fecha actual
    };

    // Envío la transacción al HomeScreen
    onAddTransaction(transaction);

    // Limpio los campos para nueva entrada
    setAmount("");
    setCategory("");
  };

  return (
    <View style={styles.container}>
      {/* Botones para cambiar tipo de transacción */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="Ingreso" color={colors.income} onPress={() => setType("income")} />
        <Button title="Gasto" color={colors.expense} onPress={() => setType("expense")} />
      </View>

      {/* Campo para ingresar monto */}
      <TextInput
        placeholder="Monto"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      {/* Dropdown de categorías */}
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
        dropdownIconColor="#fff"
      >
        <Picker.Item label="Selecciona categoría..." value="" color="#aaa" />
        {(type === "income" ? incomeCategories : expenseCategories).map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} color="#fff" />
        ))}
      </Picker>

      {/* Botón para agregar transacción */}
      <Button
        title={`Agregar ${type === "income" ? "Ingreso" : "Gasto"}`}
        color={type === "income" ? colors.income : colors.expense}
        onPress={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#1e1e1e", // fondo oscuro para resaltar el texto
  },
  picker: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#333", // fondo del picker oscuro
    color: "#fff",           // texto blanco
  },
});
