export default {
  login: {
    header: 'Sign In',
    email: 'Email',
    password: 'Password',
    forgot: 'Forgot password?',
    button: 'Sign In',
    'link-text': "Don't have an account?",
    link: 'Sign up'
  },
  register: {
    header: 'Create an Account',
    completeRegistration: 'Complete Registration',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    button: 'Sign Up',
    completeButton: 'Complete Registration',
    'link-text': 'Already have an account?',
    link: 'Sign in'
  },
  errors: {
    'fill-all': 'Please fill in all fields.',
    'login-failed': 'Login Failed',
    'sign-in': 'An error occurred during sign in.',
    'registration': 'An error occurred during registration.',
    'invalid-invitation': 'The invitation link is invalid or has expired.',
    'validation': 'Validation Error',
    'error': 'Error',
    'invalid-password': 'Invalid password',
    'user-not-found': 'No user found with this email address'
  },
  success: {
    'registration': 'Registration Successful',
    'registration-complete': 'Registration completed. Please log in with your new account.',
    'login': 'Login Successful',
    'welcome': 'Welcome back!',
    'login-success': 'Login successful'
  },
  resetPassword: {
    title: 'Reset Password',
    description: 'Follow the steps to reset your password',
    email: 'Email',
    emailPlaceholder: 'Enter your email address',
    otp: 'OTP Code',
    otpPlaceholder: 'Enter 6-digit OTP code',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter new password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your new password',
    enterEmail: 'Enter your email address to receive a one-time password',
    enterOTP: 'Enter the OTP code sent to your email',
    enterNewPassword: 'Create your new password',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    submit: 'Reset Password',
    success: {
      otpSent: 'OTP code has been sent to your email',
      otpVerified: 'OTP verified successfully',
      passwordReset: 'Password has been reset successfully'
    },
    errors: {
      invalidEmail: 'Please enter a valid email address',
      invalidOTP: 'The OTP code is invalid or has expired',
      expiredOTP: 'The OTP code has expired. Please request a new one',
      tooManyAttempts: 'Too many failed attempts. Please request a new OTP',
      emailSendFailed: 'Failed to send OTP. Please try again',
      userNotFound: 'User not found',
      failed: 'Password reset failed. Please try again',
      passwordMismatch: 'Passwords do not match',
      passwordLength: 'Password must be at least 6 characters long'
    },
    requestOTP: 'Click the button below to receive a one-time password via email'
  }
} 