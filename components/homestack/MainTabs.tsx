// components/homestack/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Forums from './Forums'; // Extract Forums into a separate component
import Garage from './Garage'; // Extract Garage into a separate component
import UserProfile from './UserProfile'; // Extract UserProfile into a separate component
import StartSession from './StartSession';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen name="Forums" component={Forums} />
      <Tab.Screen name="Rides" component={Forums} />
      <Tab.Screen
        name="Start Session"
        component={Forums}
        options={{
          tabBarButton: (props) => <StartSession {...props} />,
          tabBarIcon: ({ focused }) => (
            <Text style={{ color: focused ? '#fff' : '#aaa' }}>+</Text> 
          ),
        }} />
      <Tab.Screen name="Garage" component={Garage} />
      <Tab.Screen name="User" component={UserProfile} />
      {/* Add more tabs as needed */}
    </Tab.Navigator>
  );
}
