import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './attendance.styles';
import LogView from './LogView';
import MarkView from './MarkView';
import { useAttendanceScreen } from './useAttendanceScreen';

export default function AttendanceScreen() {
  const { tab, showMark, showLog } = useAttendanceScreen();
  return (
    <View style={styles.root}>
      <View style={styles.segment}>
        <TouchableOpacity style={[styles.segBtn, tab === 'mark' && styles.segBtnOn]} onPress={showMark}>
          <Text style={[styles.segText, tab === 'mark' && styles.segTextOn]}>Mark Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.segBtn, tab === 'log' && styles.segBtnOn]} onPress={showLog}>
          <Text style={[styles.segText, tab === 'log' && styles.segTextOn]}>Log</Text>
        </TouchableOpacity>
      </View>
      {tab === 'mark' ? <MarkView /> : <LogView />}
    </View>
  );
}
