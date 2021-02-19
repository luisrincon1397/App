import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import AjustesScreen from '../screens/AjustesScreen';
import NotasScreen from '../screens/NotasScreen';
import ContactosScreen from '../screens/ContactosScreen';
import AlertasScreen from '../screens/AlertasScreen';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Datos',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-medkit" />,
        }}
      />
      <BottomTab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: 'Estadisticas',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-stats" />,
        }}
      />
      <BottomTab.Screen
        name="Notas"
        component={NotasScreen}
        options={{
          title: 'Notas',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
      <BottomTab.Screen
        name="Contactos"
        component={ContactosScreen}
        options={{
          title: 'Contactos',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-contacts" />,
        }}
      />
      <BottomTab.Screen
        name="Alertas"
        component={AlertasScreen}
        options={{
          title: 'Alertas',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-warning" />,
        }}
      />
      <BottomTab.Screen
        name="Ajustes"
        component={AjustesScreen}
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-settings" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {

  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  switch (routeName) {
    case 'Home':
      return (<Text style={styles.titulo}>Datos</Text>);
    case 'Ajustes':
      return (<Text style={styles.titulo}>Configuración</Text>);
    case 'Stats':
      return (<Text style={styles.titulo}>Estadisticas</Text>);
    case 'Notas':
      return (<Text style={styles.titulo}>Notas</Text>);
    case 'Contactos':
      return (<Text style={styles.titulo}>Contactos de emergencia</Text>);
    case 'Alertas':
      return (<Text style={styles.titulo}>Registro de alertas</Text>);
  }
}
const styles = StyleSheet.create({
  titulo: {
    flex: 1,
    textAlign: "center",
    fontSize: 23,
    color: '#606060'
  },
});
