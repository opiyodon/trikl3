import React, { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import Link from 'next/link';

const UserProfile = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email && session?.user?.userType) {
        try {
          const endpoint = session.user.userType === 'student' ? 'students' : 'companies';
          const response = await fetch(`/api/${endpoint}?email=${session.user.email}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          toast.error(`Failed to load user data: ${error.message}`);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(`Logout error: ${error.message}`);
    }
  };

  const getUserName = () => {
    if (userData) {
      return session.user.userType === 'student' ? userData.fullName : userData.companyName;
    }
    return "User";
  };

  const getProfilePicture = () => {
    if (session.user.userType === 'student') {
      return userData?.profilePicture || "/assets/avatar.png";
    } else {
      return userData?.logo || "/assets/company-logo.png";
    }
  };

  const getProfileStrength = () => {
    return userData?.profileStrength || 0;
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          isBordered
          color="secondary"
          as="button"
          className="transition-transform"
          name={getUserName()}
          size="sm"
          src={getProfilePicture()}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat" className="p-3 w-full">
        <DropdownItem key="header" className="h-full gap-2 cursor-text" textValue="Profile Header">
          <p className="font-bold text-large">
            {session.user.userType === 'student' ? 'Student' : 'Company'} Profile
          </p>
        </DropdownItem>
        <DropdownItem key="signed-in" className="h-full gap-2 cursor-text" textValue="Signed in as">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="font-semibold">{userData?.email || session?.user?.email}</p>
        </DropdownItem>
        <DropdownItem key="profile-strength" textValue="Profile Strength">
          <p className="text-sm text-gray-500 cursor-text">Profile Strength: {getProfileStrength()}%</p>
        </DropdownItem>
        <DropdownItem key="my-account" className="h-full" textValue="My Account">
          <Link href={`/${session.user.userType}-dashboard/account`} className="text-sm text-primary">
            My Account
          </Link>
        </DropdownItem>
        <DropdownItem key="logout" className="h-full text-danger" color="danger" textValue="Log Out">
          <span className="text-sm" onClick={handleLogout}>Log Out</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfile;