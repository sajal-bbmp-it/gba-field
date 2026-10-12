import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import BuildWatermark from '../components/BuildWatermark';
import ActivitiesScreen from '../screens/activities/ActivitiesScreen';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';
import HomeScreen from '../screens/home/HomeScreen';
import WorksScreen from '../screens/works/WorksScreen';
import { colors } from '../theme';
import { tabIcon } from './TabIcon';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.brand },
        headerTintColor: colors.white,
        headerRight: () => <BuildWatermark />,
        tabBarActiveTintColor: colors.brand,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} options={{ tabBarIcon: tabIcon('📍') }} />
      <Tab.Screen name="Works" component={WorksScreen} options={{ tabBarIcon: tabIcon('🧰') }} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} options={{ tabBarIcon: tabIcon('📝') }} />
    </Tab.Navigator>
  );
}
