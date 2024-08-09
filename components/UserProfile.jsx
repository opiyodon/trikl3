import React, { useState, useEffect } from "react";
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Avatar } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/students?email=${session.user.email}`);
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

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          color="secondary"
          as="button"
          className="transition-transform"
          name={userData?.fullName || "User"}
          size="sm"
          src={userData?.profilePicture || "/assets/avatar.png"}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{userData?.email || session?.user?.email}</p>
        </DropdownItem>
        <DropdownItem key="settings" href="/student-dashboard/account">My Account</DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfile;