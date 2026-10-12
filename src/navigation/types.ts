import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type MainTabParamList = {
  Home: undefined;
  Attendance: undefined;
  Works: undefined;
  Activities: undefined;
};

export type MainTabsNavigation = BottomTabNavigationProp<MainTabParamList>;
