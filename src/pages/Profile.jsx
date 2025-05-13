import React, { useState } from 'react';
import { AlertTriangle, User, Mail, Info } from 'lucide-react';

const ProfilePage = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [bio, setBio] = useState('Edit your Bio.');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempBio, setTempBio] = useState(bio);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleSaveProfile = () => {
    setName(tempName);
    setEmail(tempEmail);
    setBio(tempBio);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setTempName(name);
    setTempEmail(email);
    setTempBio(bio);
    setIsEditing(false);
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangingPassword(false);
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type "DELETE" to confirm.');
      return;
    }
    alert('Your account has been deleted.');
    setDeleteConfirmation('');
    setIsConfirmingDelete(false);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation('');
    setIsConfirmingDelete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-yellow-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex items-start gap-x-4">
                <User className="text-gray-500 mt-1" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{name}</p>
                </div>
              </div>
              <div className="flex items-start gap-x-4">
                <Mail className="text-gray-500 mt-1" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
              <div className="flex items-start gap-x-4">
                <Info className="text-gray-500 mt-1" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="font-medium">{bio}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Password</h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancelPassword}
                  className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-red-800">Danger Zone</h2>
            {!isConfirmingDelete && (
              <button
                onClick={() => setIsConfirmingDelete(true)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Delete Account
              </button>
            )}
          </div>

          {isConfirmingDelete && (
            <div className="space-y-4">
              <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">
                    This action is permanent. All your data will be deleted and cannot be recovered.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To confirm, type "DELETE"
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
