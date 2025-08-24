import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import colors from "../theme/colors";

// Componente para agregar transacciones: ingresos o gastos
export default function TransactionForm({ onAddTransaction }) {
  // Estados locales
  const [amount, setAmount] = useState(""); // monto ingresado
  const [category, setCategory] = useState(""); // categoría seleccionada
  const [type, setType] = useState("income"); // tipo: "income" o "expense"
  const [categories, setCategories] = useState({ income: [], expense: [] }); // categorías dinámicas

  // Estado para controlar el modal de selección de categoría
  const [modalVisible, setModalVisible] = useState(false);

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

  // Obtengo categorías según el tipo de transacción
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

      {/* Botón para abrir modal de categorías */}
      <TouchableOpacity
        style={styles.categorySelector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: category ? "#fff" : "#aaa" }}>
          {category ? category : "Selecciona categoría..."}
        </Text>
      </TouchableOpacity>

      {/* Modal de selección de categorías */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona categoría</Text>
            <FlatList
              data={currentCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    category === item && { backgroundColor: colors.accent },
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, category === item && { color: "#fff" }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

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
  categorySelector: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    maxHeight: "70%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#333",
    marginBottom: 5,
  },
  modalItemText: {
    color: "#fff",
    fontSize: 16,
  },
});
