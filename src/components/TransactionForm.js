import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import colors from "../theme/colors"; // tus colores personalizados
import DropDownPicker from "react-native-dropdown-picker"; // dropdown completamente personalizable

// Componente principal del formulario de transacciones
export default function TransactionForm({ onAddTransaction }) {
  // ---------------------- Estados ----------------------
  const [amount, setAmount] = useState(""); // monto ingresado por el usuario
  const [category, setCategory] = useState(""); // categoría seleccionada
  const [type, setType] = useState("income"); // tipo de transacción: "income" o "expense"
  const [categories, setCategories] = useState({ income: [], expense: [] }); // categorías dinámicas desde JSON

  // Estados requeridos por DropDownPicker
  const [open, setOpen] = useState(false); // controla si el dropdown está abierto
  const [items, setItems] = useState([]); // lista de opciones del dropdown

  // ---------------------- Carga de categorías ----------------------
  useEffect(() => {
    // Función que descarga el JSON remoto con las categorías
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/fgattidelaconcepcion/CategoriesJson/main/categorias.json"
        );
        const data = await response.json();
        setCategories(data); // guardo las categorías en el estado
      } catch (error) {
        console.log("Error cargando categorías:", error);
      }
    };
    fetchCategories();
  }, []); // se ejecuta solo al montar el componente

  
  useEffect(() => {
    // Mapear las categorías actuales a objetos que DropDownPicker entiende
    const newItems =
      type === "income"
        ? categories.income.map((c) => ({
            label: c, // lo que se ve en el dropdown
            value: c, // valor interno
            labelStyle: { color: "#fff" }, // texto blanco
          }))
        : categories.expense.map((c) => ({
            label: c,
            value: c,
            labelStyle: { color: "#fff" },
          }));
    setItems(newItems); // actualizo items del dropdown
    setCategory(""); // limpio selección al cambiar de tipo
  }, [categories, type]); // se ejecuta cuando cambian categorías o tipo

  // ---------------------- Función para agregar transacción ----------------------
  const handleAdd = () => {
    // Validar que monto y categoría estén completos
    if (!amount || !category) {
      Alert.alert("Error", "Por favor ingresa monto y categoría");
      return;
    }

    // Crear objeto transacción
    const transaction = {
      id: Date.now().toString(), // ID único
      type,
      amount: Math.abs(parseFloat(amount)), // monto positivo
      category,
      date: new Date().toLocaleDateString(), // fecha actual
    };

    onAddTransaction(transaction); // envío la transacción al componente padre

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
        placeholderTextColor={colors.textSecondary} // texto gris claro cuando está vacío
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      {/* Dropdown de categorías */}
      <DropDownPicker
        open={open} // controla apertura
        value={category} // valor seleccionado
        items={items} // opciones del dropdown
        setOpen={setOpen} // función para abrir/cerrar
        setValue={setCategory} // función para seleccionar categoría
        setItems={setItems} // función para actualizar items dinámicamente
        placeholder="Selecciona categoría..."
        style={styles.dropdown} // estilo del dropdown cerrado
        textStyle={{ color: "#fff" }} // texto visible
        dropDownContainerStyle={styles.dropdownContainer} // estilo del contenedor abierto
      />

      {/* Botón para agregar la transacción */}
      <Button
        title={`Agregar ${type === "income" ? "Ingreso" : "Gasto"}`}
        color={type === "income" ? colors.income : colors.expense}
        onPress={handleAdd}
      />
    </View>
  );
}

// Estilos 
const styles = StyleSheet.create({
  container: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#fff", // texto blanco
    backgroundColor: "#1e1e1e", // fondo oscuro
  },
  dropdown: {
    backgroundColor: "#1e1e1e", // fondo del dropdown cerrado
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownContainer: {
    backgroundColor: "#333", // fondo del contenedor abierto
    borderRadius: 8,
  },
});
