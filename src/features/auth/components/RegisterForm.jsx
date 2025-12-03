import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input, Checkbox, Select } from '@components/forms';
import { Button } from '@components/common';
import { useAuth } from '@hooks/useAuth';

const registerSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string().required('Please select a role'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms'),
});

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'attendee', label: 'Attendee - I want to discover and book events' },
    { value: 'organizer', label: 'Organizer - I want to create and manage events' },
  ];

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const result = await register({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setFieldError('email', result.error);
    }
    setSubmitting(false);
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
            Create your account
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Join FlowGateX and start your event journey
          </p>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: '',
              agreeToTerms: false,
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Input
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  leftIcon="person"
                />

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
                    placeholder="Create a strong password"
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

                <Input
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  leftIcon="lock"
                />

                <Select
                  name="role"
                  label="I am signing up as"
                  options={roleOptions}
                  placeholder="Select your role"
                />

                <Checkbox
                  name="agreeToTerms"
                  label={
                    <span>
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  }
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full mt-4"
                >
                  Create Account
                </Button>
              </Form>
            )}
          </Formik>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
