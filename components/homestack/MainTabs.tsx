// components/homestack/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Forums from './Forums'; // Extract Forums into a separate component
import Garage from './Garage'; // Extract Garage into a separate component
import UserProfile from './UserProfile'; // Extract UserProfile into a separate component
import Rides from './Rides'; // Extract Rides into a separate component
import Host from './Host'; // Extract Host into a separate component
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { View } from 'react-native';


const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route})=>({
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter_18pt-SemiBold',
          marginTop: 1,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingTop: 2,
          paddingBottom: 2,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
            switch (route.name) {
                    case 'Forums':
                      iconName = 'forum';
                      break;
                    case 'Rides':
                      iconName = 'motorbike';
                      break;
                    case 'Host':
                      iconName = 'bullhorn-variant';
                      break;
                    case 'Garage':
                      iconName = 'garage';
                      break;
                    case 'User':
                      iconName = 'account';
                      break;
            }
      return (
        <View style={{ 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: 2,
        }}>
          <MaterialCommunityIcons
            name={iconName}
            size={focused ? 26 : 24}
            color={focused ? '#C62828' : '#888'}
          />
        </View>
      );
    },
    tabBarActiveTintColor: '#C62828',
    tabBarInactiveTintColor: '#888',
  })}>
      <Tab.Screen name="Forums" component={Forums} />
      <Tab.Screen name="Rides" component={Rides} />
      <Tab.Screen name="Host" component={Host}/>
      <Tab.Screen name="Garage" component={Garage} />
      <Tab.Screen name="User" component={UserProfile} />
      {/* Add more tabs as needed */}
    </Tab.Navigator>
  );
}