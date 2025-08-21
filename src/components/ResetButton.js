import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

// Botón reutilizable.
// onPress: función a ejecutar
// label: texto del botón
// variant: "danger" (rojo) | "success" (verde) | "default" (gris)
export default function ResetButton({ onPress, label = "Reiniciar Mes", variant = "danger" }) {
  const bg =
    variant === "success" ? "#2ecc71" :
    variant === "danger" ? "#e74c3c" :
    "#444";

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: bg }]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
