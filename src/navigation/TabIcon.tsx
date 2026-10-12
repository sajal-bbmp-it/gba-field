import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({ icon: { fontSize: 18 } });

export const tabIcon = (emoji: string) => () => <Text style={styles.icon}>{emoji}</Text>;
