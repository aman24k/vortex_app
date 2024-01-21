import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DialScreen from './DialScreen';
import HistoryScreen from './HistoryScreen';
import ContactsScreen from './ContactsScreen';
import SettingsScreen from './SettingsScreen';
import HeaderGen from '../components/Header/HeaderGen';
const Tab = createBottomTabNavigator();
const HomeScreen = () => {
  return (
    <Tab.Navigator initialRouteName="Dial">
      <Tab.Screen
        name="Dial"
        component={DialScreen}
        options={{
          header: HeaderGen('Dial'),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          header: HeaderGen('History'),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          header: HeaderGen('Contacts'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: HeaderGen('Settings'),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
