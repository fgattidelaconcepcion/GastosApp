import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, Pressable, Modal, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import BalanceCard from "../components/BalanceCard";
import TransactionForm from "../components/TransactionForm";
import TransactionItem from "../components/TransactionItem";
import CategoryChart from "../components/CategoryChart";
import ResetButton from "../components/ResetButton";

export default function HomeScreen() {
  
  // Estados principales de la pantalla

  const [transactions, setTransactions] = useState([]); // todas las transacciones
  const [balance, setBalance] = useState(0); // balance actual
  const [backup, setBackup] = useState(null); // backup para deshacer reinicio

  
  // Control del modal de reinicio

  const [modalVisible, setModalVisible] = useState(false); // si el modal está visible
  const [modalAnim] = useState(new Animated.Value(0)); // animación de aparición/desaparición


  // Cargo datos de AsyncStorage al iniciar
  
  useEffect(() => {
    (async () => {
      try {
        const savedTx = await AsyncStorage.getItem("transactions");
        const savedBal = await AsyncStorage.getItem("balance");
        setTransactions(savedTx ? JSON.parse(savedTx) : []);
        setBalance(savedBal ? Number(savedBal) : 0);
      } catch (e) {
        console.log("Error cargando datos:", e);
      }
    })();
  }, []);

  
  // Guardado automático de cambios en AsyncStorage

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem("transactions", JSON.stringify(transactions));
        await AsyncStorage.setItem("balance", balance.toString());
      } catch (e) {
        console.log("Error guardando datos:", e);
      }
    })();
  }, [transactions, balance]);

 
  // Función para agregar una transacción
  
  const addTransaction = (transaction) => {
    const amt = parseFloat(transaction.amount);
    if (isNaN(amt)) return;

    setTransactions((prev) => [...prev, transaction]);
    setBalance((prev) =>
      transaction.type === "income" ? prev + Math.abs(amt) : prev - Math.abs(amt)
    );
  };

 
  // Funciones para mostrar/cerrar el modal con animación
  
  const openResetModal = () => {
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeResetModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };


  // Función para reiniciar mes
  
  const resetMonth = () => {
    // Guardamos un backup antes de reiniciar
    setBackup({ transactions, balance });

    // Reiniciamos transacciones y balance
    setTransactions([]);
    setBalance(0);

    // Cerramos el modal
    closeResetModal();

    // Mostramos un toast informativo
    Toast.show({
      type: "info",
      text1: "Mes Reiniciado",
      text2: "Todas las transacciones y el balance fueron reiniciados",
      position: "top",
      visibilityTime: 2500,
      autoHide: true,
    });
  };

  
  // Función para deshacer el reinicio
 
  const undoReset = () => {
    if (!backup) return;

    setTransactions(backup.transactions);
    setBalance(backup.balance);
    setBackup(null);

    // Mostramos un toast de confirmación
    Toast.show({
      type: "success",
      text1: "Reinicio Deshecho",
      text2: "Se restauró el balance y las transacciones",
      position: "top",
      visibilityTime: 2500,
      autoHide: true,
    });
  };

  
  // Renderizado del header de la FlatList
  // Contiene balance, formulario, gráfico y botones
  
  const renderHeader = () => (
    <View>
      <BalanceCard balance={balance} />
      <TransactionForm onAddTransaction={addTransaction} />
      <CategoryChart transactions={transactions} />
      <ResetButton onPress={openResetModal} label="🔄 Reiniciar Mes" />
      <ResetButton onPress={undoReset} label="↩️ Deshacer Reinicio" variant="success" />
    </View>
  );

  
  // Renderizado principal de HomeScreen
 
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListHeaderComponent={renderHeader} // header con todo lo que va arriba
        contentContainerStyle={styles.listContainer}
      />

      {/* -----------------------------
          Modal de confirmación de reinicio
          ----------------------------- */}
      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { opacity: modalAnim }]}>
            <Text style={styles.modalTitle}>Reiniciar Mes</Text>
            <Text style={styles.modalMessage}>
              ¿Seguro que quieres reiniciar todas las transacciones y el balance?
            </Text>
            <View style={styles.modalButtons}>
              {/* Botón cancelar */}
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={closeResetModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>

              {/* Botón confirmar */}
              <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={resetMonth}>
                <Text style={styles.modalButtonText}>Reiniciar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}


// Estilos

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  listContainer: { padding: 16, paddingBottom: 50 },

  // Fondo semitransparente del modal
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Contenedor principal del modal
  modalContainer: {
    width: "85%",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },

  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },

  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },

  cancelButton: { backgroundColor: "#555" },
  confirmButton: { backgroundColor: "#e74c3c" },

  modalButtonText: { color: "#fff", fontWeight: "bold" },
});