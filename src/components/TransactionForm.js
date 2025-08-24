import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import colors from "../theme/colors";
import DropDownPicker from "react-native-dropdown-picker";

// Componente para agregar transacciones: ingresos o gastos
export default function TransactionForm({ onAddTransaction }) {
  // Estados locales
  const [amount, setAmount] = useState(""); // monto ingresado
  const [category, setCategory] = useState(""); // categoría seleccionada
  const [type, setType] = useState("income"); // tipo: "income" o "expense"

  const [categories, setCategories] = useState({ income: [], expense: [] }); // categorías dinámicas

  // Estados para DropdownPicker
  const [open, setOpen] = useState(false); // controla si el dropdown está abierto
  const [items, setItems] = useState([]); // items del dropdown

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

  // Actualizo los items del dropdown cuando cambian las categorías o el tipo
  useEffect(() => {
    // mapeo las categorías agregando labelStyle para que el texto sea blanco en Android
    const newItems =
      type === "income"
        ? categories.income.map((c) => ({ label: c, value: c, labelStyle: { color: "#fff" } }))
        : categories.expense.map((c) => ({ label: c, value: c, labelStyle: { color: "#fff" } }));
    setItems(newItems);

    // Reseteo la categoría seleccionada al cambiar tipo
    setCategory("");
  }, [categories, type]);

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

      {/* Dropdown de categorías dinámicas */}
      <DropDownPicker
        open={open} // controla si el dropdown está abierto
        value={category} // valor seleccionado
        items={items} // items del dropdown
        setOpen={setOpen} // setter para abrir/cerrar dropdown
        setValue={setCategory} // setter para cambiar valor
        setItems={setItems} // setter para actualizar items
        placeholder="Selecciona categoría..." // placeholder
        style={styles.dropdown} // estilo del dropdown cerrado
        textStyle={{ color: "#fff" }} // color del texto del dropdown cerrado
        dropDownContainerStyle={styles.dropdownContainer} // fondo del dropdown abierto
      />

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
  dropdown: {
    backgroundColor: "#1e1e1e", // fondo del dropdown cerrado
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownContainer: {
    backgroundColor: "#333", // fondo del dropdown abierto
    borderRadius: 8,
  },
});
