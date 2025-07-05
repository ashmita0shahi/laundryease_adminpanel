import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import Alert from '../../components/common/Alert';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [resetStatus, setResetStatus] = useState({ 
    type: null, // 'success' or 'error'
    message: null 
  });
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await resetPassword(values.email);
      
      if (result.success) {
        setResetStatus({ 
          type: 'success', 
          message: 'Password reset instructions have been sent to your email.'
        });
        resetForm();
      } else {
        setResetStatus({ 
          type: 'error', 
          message: result.message || 'Failed to send password reset email.'
        });
      }
    } catch (error) {
      setResetStatus({ 
        type: 'error', 
        message: 'An error occurred while processing your request.'
      });
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
            Reset Password
          </h1>
          <h2 className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Enter your email to receive password reset instructions
          </h2>
        </div>
        
        {resetStatus.type && (
          <Alert
            type={resetStatus.type}
            message={resetStatus.message}
            dismissible={true}
            onDismiss={() => setResetStatus({ type: null, message: null })}
          />
        )}
        
        <div className="card">
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
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
                    placeholder="Enter your email address"
                  />
                  <ErrorMessage name="email" component="div" className="form-error" />
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
                        Sending...
                      </div>
                    ) : 'Send Reset Link'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          
          <div className="mt-4 text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Back to Sign In
            </Link>
          </div>
        </div>
        
        <div className="text-sm text-center text-gray-600 dark:text-gray-400">
          Need help?{' '}
          <a href="mailto:support@laundryease.com" className="text-primary-600 hover:text-primary-500">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
