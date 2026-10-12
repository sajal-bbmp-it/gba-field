import { useCallback, useState } from 'react';
import { auth } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import { useAuth } from '../../auth/AuthContext';
import { ENGINEER_ROLES } from '../../config/constants';
import { digitsOnly, isValidMobile, isValidOtp } from '../../utils/validation';

export type LoginStep = 'mobile' | 'otp';

export function useLogin() {
  const { login } = useAuth();
  const [step, setStep] = useState<LoginStep>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  // Editing the field dismisses its error.
  const onMobileChange = useCallback((t: string) => {
    setMobile(digitsOnly(t));
    setError('');
  }, []);
  const onOtpChange = useCallback((t: string) => {
    setOtp(digitsOnly(t));
    setError('');
  }, []);

  const requestOtp = useCallback(async () => {
    setError('');
    setInfo('');
    if (!isValidMobile(mobile)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setBusy(true);
    try {
      const res = await auth.requestOtp(mobile);
      setStep('otp');
      setInfo(res?.message || 'OTP shared to your registered mobile.');
    } catch (err) {
      setError(apiError(err, 'Could not send OTP.'));
    } finally {
      setBusy(false);
    }
  }, [mobile]);

  const verifyOtp = useCallback(async () => {
    setError('');
    if (!isValidOtp(otp)) {
      setError('Enter the OTP you received.');
      return;
    }
    setBusy(true);
    try {
      const res = await auth.verifyOtp(mobile, otp);
      if (!ENGINEER_ROLES.includes(res.user?.role)) {
        setError('This app is for field engineers (AE/AEE/EE). Please use the web dashboard.');
        return;
      }
      await login(res.access_token, res.user);
    } catch (err) {
      setError(apiError(err, 'OTP verification failed.'));
    } finally {
      setBusy(false);
    }
  }, [login, mobile, otp]);

  const changeNumber = useCallback(() => {
    setStep('mobile');
    setOtp('');
    setInfo('');
    setError('');
  }, []);

  return { step, mobile, otp, error, info, busy, onMobileChange, onOtpChange, requestOtp, verifyOtp, changeNumber };
}
