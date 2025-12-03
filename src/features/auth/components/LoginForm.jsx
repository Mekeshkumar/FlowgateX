import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input, Checkbox } from '@components/forms';
import { Button } from '@components/common';
import { useAuth } from '@hooks/useAuth';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  rememberMe: Yup.boolean(),
});

// Demo credentials for different roles
const demoCredentials = [
  {
    role: 'Admin',
    email: 'admin@flowgatex.com',
    password: 'Admin@123',
    icon: 'admin_panel_settings',
    color: 'bg-red-100 text-red-600 border-red-200 hover:bg-red-50',
  },
  {
    role: 'Organizer',
    email: 'organizer@flowgatex.com',
    password: 'Organizer@123',
    icon: 'event_available',
    color: 'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-50',
  },
  {
    role: 'User',
    email: 'user@flowgatex.com',
    password: 'User@123',
    icon: 'person',
    color: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-50',
  },
];

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const result = await login({
      email: values.email,
      password: values.password,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setFieldError('email', result.error);
    }
    setSubmitting(false);
  };

  const handleDemoLogin = (credentials, setFieldValue) => {
    setFieldValue('email', credentials.email);
    setFieldValue('password', credentials.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-400 rounded-xl flex items-center justify-center">
              <span className="material-icons text-white text-xl">bolt</span>
            </div>
            <span className="font-display font-bold text-2xl text-gray-900">
              FlowGate<span className="text-primary-600">X</span>
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Sign in to your account to continue
          </p>

          <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                {/* Demo Credentials Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3 text-center font-medium">
                    🚀 Quick Demo Login
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {demoCredentials.map((cred) => (
                      <button
                        key={cred.role}
                        type="button"
                        onClick={() => handleDemoLogin(cred, setFieldValue)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${cred.color}`}
                      >
                        <span className="material-icons text-lg">{cred.icon}</span>
                        <span className="text-xs font-medium">{cred.role}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Click to auto-fill credentials
                  </p>
                </div>

                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  leftIcon="mail"
                />

                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    leftIcon="lock"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-icons text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <Checkbox name="rememberMe" label="Remember me" />
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="material-icons text-gray-700">facebook</span>
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
