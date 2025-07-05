import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/common/Alert';
import {
  UserCircleIcon,
  KeyIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateUserProfile, updatePassword } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setProfileLoading(true);
      setProfileMessage({ type: '', text: '' });
      
      await updateUserProfile(profileForm);
      
      setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setProfileMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setProfileLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    try {
      setPasswordLoading(true);
      setPasswordMessage({ type: '', text: '' });
      
      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
      
      // Clear form after successful update
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update password'
      });
    } finally {
      setPasswordLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <UserCircleIcon className="w-5 h-5 mr-2" />
              Profile Information
            </h2>
            
            {profileMessage.text && (
              <Alert 
                type={profileMessage.type} 
                message={profileMessage.text} 
                className="mb-4" 
              />
            )}
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileForm.phoneNumber}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={profileLoading}
                >
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Change Password */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <KeyIcon className="w-5 h-5 mr-2" />
              Change Password
            </h2>
            
            {passwordMessage.text && (
              <Alert 
                type={passwordMessage.type} 
                message={passwordMessage.text} 
                className="mb-4" 
              />
            )}
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
