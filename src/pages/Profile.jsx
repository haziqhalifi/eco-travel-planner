import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { User, Mail, Home } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

const ProfileForm = () => {
  const { user, updateUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      location: '',
      bio: '',
      preferredTransportation: user?.preferences?.preferredTransportation || [],
      dietaryPreferences: user?.preferences?.dietaryPreferences || [],
      accommodationPreferences: user?.preferences?.accommodationPreferences || [],
    }
  });
  
  const onSubmit = async (data) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in auth store
      updateUser({
        name: data.name,
        preferences: {
          preferredTransportation: data.preferredTransportation,
          dietaryPreferences: data.dietaryPreferences,
          accommodationPreferences: data.accommodationPreferences
        }
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };
  
  const transportationOptions = [
    { value: 'walking', label: 'Walking' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'train', label: 'Train' },
    { value: 'bus', label: 'Bus' },
    { value: 'electric-car', label: 'Electric Car' },
    { value: 'car-sharing', label: 'Car Sharing' },
    { value: 'sailing', label: 'Sailing' },
  ];
  
  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'organic', label: 'Organic' },
    { value: 'local', label: 'Locally Sourced' },
  ];
  
  const accommodationOptions = [
    { value: 'eco-lodge', label: 'Eco Lodge' },
    { value: 'green-hotel', label: 'Green Hotel' },
    { value: 'camping', label: 'Camping' },
    { value: 'homestay', label: 'Local Homestay' },
    { value: 'farm-stay', label: 'Farm Stay' },
  ];
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-earth-800 mb-6">Your Profile</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            leftIcon={<User size={18} />}
            fullWidth
            error={errors.name?.message}
            {...register('name', {
              required: 'Full name is required',
            })}
          />
          
          <Input
            label="Email Address"
            type="email"
            leftIcon={<Mail size={18} />}
            fullWidth
            disabled
            {...register('email')}
          />
          
          <Input
            label="Location"
            leftIcon={<Home size={18} />}
            fullWidth
            error={errors.location?.message}
            {...register('location')}
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            className="block w-full rounded-md border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 p-3"
            placeholder="Tell us a bit about yourself and your eco-travel experience"
            {...register('bio')}
          ></textarea>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-earth-800 mb-3">Travel Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Transportation
              </label>
              <div className="flex flex-wrap gap-3">
                {transportationOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-primary-50 rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      {...register('preferredTransportation')}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preferences
              </label>
              <div className="flex flex-wrap gap-3">
                {dietaryOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-primary-50 rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      {...register('dietaryPreferences')}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accommodation Preferences
              </label>
              <div className="flex flex-wrap gap-3">
                {accommodationOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-primary-50 rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      {...register('accommodationPreferences')}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    preferences: PropTypes.shape({
      preferredTransportation: PropTypes.arrayOf(PropTypes.string),
      dietaryPreferences: PropTypes.arrayOf(PropTypes.string),
      accommodationPreferences: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  updateUser: PropTypes.func,
};

export default ProfileForm;
