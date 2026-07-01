import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Camera, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Initialize fields
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfilePic(user.profilePic || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setProfilePic(base64String);
      
      // Instantly update avatar in DB
      try {
        const res = await updateProfile({ profilePic: base64String });
        if (res.success) {
          toast.success('Avatar updated successfully!');
        }
      } catch (err) {
        toast.error('Failed to upload image file');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    setIsUpdatingInfo(true);
    const res = await updateProfile({ name, email });
    setIsUpdatingInfo(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please enter all password parameters');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    // Send password payload
    const res = await updateProfile({
      password: newPassword,
    });
    setIsUpdatingPassword(false);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Profile Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Customize your ledger personalizations and credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Avatar Customization */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative group">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-950/50"
              />
            ) : (
              <div className="flex items-center justify-center w-32 h-32 text-4xl font-extrabold text-white bg-indigo-650 rounded-full">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full cursor-pointer shadow-md transition-all duration-205">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>Active Member</span>
          </div>
        </div>

        {/* Right Pane: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form 1: General Info */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Account Information</h4>
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingInfo}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-555 bg-indigo-600 rounded-lg shadow-sm transition-colors"
                >
                  {isUpdatingInfo ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Password Update */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-sm">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Change Password</h4>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-555 bg-indigo-600 rounded-lg shadow-sm transition-colors"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
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
