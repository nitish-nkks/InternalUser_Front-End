import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser } from '../utils/auth';
import { getInternalUserDetails } from '../api/api';

const ProfileContext = createContext(undefined);

const STORAGE_KEYS = {
  PROFILE_DATA: 'admin_profile_data',
  PROFILE_PICTURE: 'admin_profile_picture'
};

const defaultProfile = {
  employee_id: null,
  name: null,
  email: null,
  role: null,
  designation: null,
  lastloginat: null,
  settings: {
    twoFactorAuth: false,
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
};

const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  }
};

const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const storedUser = getStoredUser();
        if (storedUser && storedUser.id) {
          const response = await getInternalUserDetails(storedUser.id);
          const userData = response.data.data;

          const roleMapping = {
            'Admin': 'Admin',
            'Staff': 'Staff',
            'Manager': 'Manager',
            'Support': 'Support',
            'Sales': 'Sales'
          };

          const mappedProfile = {
            ...storedUser, 
            employee_id: userData.employeeId,
            name: userData.userName,
            email: userData.email,
            role: roleMapping[userData.role] || 'Unknown Role',
            designation: userData.designation,
            lastloginat: userData.lastLoginAt,
            settings: {
              ...defaultProfile.settings,
              ...(storedUser.settings || {}),
               notifications: {
                ...defaultProfile.settings.notifications,
                ...((storedUser.settings && storedUser.settings.notifications) || {}),
              },
            },
          };

          setProfile(mappedProfile);
          storage.set("userDetails", mappedProfile);

        } else {
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfile(getStoredUser() || defaultProfile);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = (updates) => {
    if (!profile) return false;

    const updatedProfile = {
      ...profile,
      ...updates,
      lastModified: new Date().toISOString()
    };

    setProfile(updatedProfile);
    
    localStorage.setItem("userDetails", JSON.stringify(updatedProfile));

    return true;
  };

  const updateProfilePicture = (newProfilePicture) => {
    if (!profile) return false;

    const updatedProfile = {
      ...profile,
      profilePicture: newProfilePicture,
      lastModified: new Date().toISOString()
    };

    setProfile(updatedProfile);
    
    localStorage.setItem("userDetails", JSON.stringify(updatedProfile));

    return true;
  };

  const clearAllProfileData = () => {
    setProfile(null);
    storage.remove(STORAGE_KEYS.PROFILE_DATA);
    storage.remove(STORAGE_KEYS.PROFILE_PICTURE);
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
    storage.set(STORAGE_KEYS.PROFILE_DATA, defaultProfile);
    storage.remove(STORAGE_KEYS.PROFILE_PICTURE);
  };

  const getProfilePictureUrl = () => {
    return profile?.profilePicture || '';
  };

  const hasCustomProfilePicture = () => {
    return !!(profile?.profilePicture && profile.profilePicture.trim());
  };

  const contextValue = {
    profile,
    isLoading,
    updateProfile,
    updateProfilePicture,
    clearAllProfileData,
    resetProfile,
    getProfilePictureUrl,
    hasCustomProfilePicture
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export { ProfileProvider, useProfile, ProfileContext };