import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ContactHomeScreen from './components/ContactHomeScreen';
import AddContactScreen from './components/AddContactScreen';

export default function ContactsScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactHomeScreen"
        component={ContactHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddContactScreen"
        component={AddContactScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
