import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import colors from "../theme/colors"; // tus colores personalizados
import DropDownPicker from "react-native-dropdown-picker";

export default function TransactionForm({ onAddTransaction }) {
  const [amount, setAmount] = useState(""); // monto ingresado por el usuario
  const [category, setCategory] = useState(""); // categoría seleccionada
  const [type, setType] = useState("income"); // tipo de transacción
  const [categories, setCategories] = useState({ income: [], expense: [] }); // categorías dinámicas desde JSON

  // Estados del dropdown
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  // Cargar categorías desde JSON remoto
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

  // Actualizar opciones según tipo (ingreso o gasto)
  useEffect(() => {
    const newItems =
      type === "income"
        ? categories.income.map((c) => ({ label: c, value: c }))
        : categories.expense.map((c) => ({ label: c, value: c }));

    setItems(newItems);
    setCategory(""); // limpiar selección al cambiar tipo
  }, [categories, type]);

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

    // limpiar campos
    setAmount("");
    setCategory("");
  };

  return (
    <View style={styles.container}>
      {/* Botones para elegir tipo */}
      <View style={styles.typeButtons}>
        <Button title="Ingreso" color={colors.income} onPress={() => setType("income")} />
        <Button title="Gasto" color={colors.expense} onPress={() => setType("expense")} />
      </View>

      {/* Campo monto */}
      <TextInput
        placeholder="Monto"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      {/* Dropdown categorías */}
      <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setItems={setItems}
        setValue={(callback) => {
          const value = callback(category);
          setCategory(value);
        }}
        placeholder="Selecciona categoría..."
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={{ color: "#fff" }}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />

      {/* Botón confirmar */}
      <Button
        title={`Agregar ${type === "income" ? "Ingreso" : "Gasto"}`}
        color={type === "income" ? colors.income : colors.expense}
        onPress={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, zIndex: 1000 }, // importante zIndex
  typeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#1e1e1e",
  },
  dropdown: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownContainer: {
    backgroundColor: "#333",
    borderRadius: 8,
    maxHeight: 400, 
    zIndex: 2000,
    elevation: 14,
  },
});
