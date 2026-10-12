import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorMessage from '../../components/ErrorMessage';
import KeyboardAwareScroll from '../../components/KeyboardAwareScroll';
import { styles } from './login.styles';
import { useLogin } from './useLogin';

export default function LoginScreen() {
  const {
    step, mobile, otp, error, info, busy,
    onMobileChange, onOtpChange, requestOtp, verifyOtp, changeNumber,
  } = useLogin();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScroll contentStyle={styles.scroll}>
        <Text style={styles.logo}>GBA</Text>
        <Text style={styles.title}>Greater Bengaluru Authority</Text>
        <Text style={styles.subtitle}>Field Engineer — Attendance & Activities</Text>

        {!!info && <Text style={styles.info}>{info}</Text>}

        {step === 'mobile' ? (
          <>
            <Text style={styles.label}>Registered Mobile Number</Text>
            <TextInput
              style={[styles.input, !!error && styles.inputError]}
              keyboardType="number-pad"
              maxLength={10}
              placeholder="10-digit mobile"
              value={mobile}
              onChangeText={onMobileChange}
            />
            <ErrorMessage message={error} style={styles.fieldError} />
            <TouchableOpacity style={styles.btn} onPress={requestOtp} disabled={busy}>
              <Text style={styles.btnText}>{busy ? 'Sending…' : 'Send OTP'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={[styles.input, !!error && styles.inputError]}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="6-digit OTP"
              value={otp}
              onChangeText={onOtpChange}
            />
            <ErrorMessage message={error} style={styles.fieldError} />
            <TouchableOpacity style={styles.btn} onPress={verifyOtp} disabled={busy}>
              <Text style={styles.btnText}>{busy ? 'Verifying…' : 'Verify & Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={changeNumber}>
              <Text style={styles.linkText}>Change number</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAwareScroll>
    </SafeAreaView>
  );
}
