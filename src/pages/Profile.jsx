import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProfileForm from '../components/profile/ProfileForm';

const ProfilePage = () => {
  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-800 to-earth-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Your Profile</h1>
          <p className="mt-2 text-lg opacity-90">Manage your account and eco-travel preferences</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProfileForm />
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
