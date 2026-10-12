import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './home.styles';
import { useHome } from './useHome';

export default function HomeScreen() {
  const {
    user, roleLabel, trail, error, refreshing, onRefresh, checkedIn, statusText,
    attendanceButtonLabel, goAttendance, goWorks, goActivities, logout,
  } = useHome();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.card}>
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.rowWrap}>
          <Text style={styles.roleBadge}>{roleLabel}</Text>
          <Text style={styles.juris}>📍 {trail}</Text>
        </View>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Attendance</Text>
        {!checkedIn ? (
          <Text style={styles.muted}>You have not checked in yet.</Text>
        ) : (
          <Text style={styles.status}>{statusText}</Text>
        )}
        <TouchableOpacity style={styles.btn} onPress={goAttendance}>
          <Text style={styles.btnText}>{attendanceButtonLabel}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.tile} onPress={goWorks}>
          <Text style={styles.tileIcon}>🧰</Text>
          <Text style={styles.tileText}>My Works</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={goActivities}>
          <Text style={styles.tileIcon}>📝</Text>
          <Text style={styles.tileText}>Log Activity</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
