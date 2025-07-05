import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import Alert from '../../components/common/Alert';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('Login failed. Please check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            LaundryEase <span className="text-primary-600">Admin</span>
          </h1>
          <h2 className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard
          </h2>
        </div>
        
        {loginError && (
          <Alert
            type="error"
            message={loginError}
            dismissible={true}
            onDismiss={() => setLoginError(null)}
          />
        )}
        
        <div className="card">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="form-input"
                    placeholder="admin@laundryease.com"
                  />
                  <ErrorMessage name="email" component="div" className="form-error" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                      Forgot password?
                    </Link>
                  </div>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="form-input"
                  />
                  <ErrorMessage name="password" component="div" className="form-error" />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn btn-primary py-2 px-4"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : 'Sign in'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        
        <div className="text-sm text-center text-gray-600 dark:text-gray-400">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
