import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

import Weather from './src/Components/Views/Weather';
import ToDo from './src/Components/Views/Todo';
import Diary from './src/Components/Views/Diary';
import History from './src/Components/Views/History';

export default function App() {
  const Tab = createBottomTabNavigator();

  return(
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Weather"
        screenOptions={{
          tabBarActiveTintColor: "black"
        }}>
        <Tab.Screen
          name="Today's Weather is like"
          component={ Weather }
          options={{
            tabBarLabel: "Weather",
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="day-cloudy" size={ size } color={ color} />
            ),
          }}
        />
        <Tab.Screen
          name="My To Do List is like"
          component={ ToDo }
          options={{
            tabBarLabel: "To Do",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="clipboard-text-outline" size={ size } color={ color } />
            ),
          }}
        />
        <Tab.Screen
          name="My Day was like"
          component={ Diary }
          options={{
            tabBarLabel: "Diary",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="notebook-outline" size={ size } color={ color } />
            ),
          }}
          />
        <Tab.Screen
          name="My Log History looks like"
          component={ History }
          options={{
            tabBarLabel: "Personal Log",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar-month" size={ size } color={ color } />
            ),
          }}
          />
      </Tab.Navigator>
    </NavigationContainer>
  );
};