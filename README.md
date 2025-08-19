**GastosApp** 
**GastosApp** es una aplicación móvil desarrollada en **React Native con Expo**, pensada para gestionar de manera simple y clara tus ingresos y gastos mensuales. La app permite registrar transacciones, ver el balance en tiempo real, visualizar gastos por categoría y reiniciar el mes manualmente. Ideal para tener un control rápido de tus finanzas personales.

---

## 📱 Características principales

- Registro de **ingresos** y **gastos** con monto y categoría.
- **Balance mensual** actualizado automáticamente.
- **Historial de transacciones** con detalle de cada movimiento.
- **Gráfico circular** de gastos por categoría.
- **Botón para reiniciar el mes** manualmente.
- Interfaz elegante con **fondo oscuro** y colores diferenciados para ingresos y gastos.
- Modular, con componentes reutilizables y código limpio.

---

## 🛠 Tecnologías utilizadas

- **React Native**  
- **Expo**  
- **react-native-chart-kit** para los gráficos circulares  
- Estilos con **StyleSheet** y **colores personalizados**

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio:  
   ```bash
   git clone https://github.com/TU_USUARIO/MiControlDeGastos.git
   cd MiControlDeGastos
Instalar dependencias:

bash
Copiar
Editar
npm install
Iniciar la app con Expo:

bash
Copiar
Editar
npx expo start
Escanear el código QR con tu dispositivo o usar un emulador para probar la aplicación.

🧩 Estructura del proyecto
bash
Copiar
Editar
MiControlDeGastos/
├─ src/
│  ├─ components/      # Componentes reutilizables (BalanceCard, TransactionForm, etc.)
│  ├─ screens/         # Pantallas principales (HomeScreen)
│  └─ theme/           # Colores y estilos globales
├─ App.js               # Entrada principal de la aplicación
├─ package.json
└─ README.md
