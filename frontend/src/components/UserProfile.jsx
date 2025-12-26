import React, { useEffect, useState } from 'react';
import dummyProf from '/images/profile.png';
import Profile from './Profile';
import Loader from './Loader';
import api from '../api/api';

const UserProfile = ({ makeLogout }) => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState(false);
  const [loader, setLoader] = useState(false);

  const getProfile = async () => {
    try {
      setLoader(true);
      const res = await api.get('/userDetails');
      setUser(res.data);
    } catch (error) {
      console.log(error?.response?.status);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loader) return <Loader />;

  return (
    <div className="relative flex items-center">

      {/* AVATAR BUTTON */}
      {!profile && (
        <img
          src={user.avatar?.url || dummyProf}
          alt="profile"
          className="cursor-pointer h-8 w-8 rounded-full object-cover"
          onClick={() => setProfile(true)}
        />
      )}

      {/* LOGOUT ICON */}
      {profile && (
        <button
          title="Logout"
          onClick={makeLogout}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:shadow-[0px_0px_20px_white]"
        >
          <i className="fa-solid fa-right-from-bracket text-lg" />
        </button>
      )}

      {/* PROFILE PANEL */}
      {profile && (
        <div className="
          absolute
          top-10
          right-0
          z-50
          w-screen
          sm:max-w-md
          md:max-w-lg
          rounded-2xl
          overflow-hidden
          bg-[linear-gradient(310deg,rgba(9,15,13,1)_0%,rgba(1,1,1,1)_65%,rgba(0,163,0,1)_100%)]
        ">
          <Profile user={user} setProfile={setProfile} getProfile={getProfile} />
        </div>
      )}

    </div>
  );
};

export default UserProfile;
