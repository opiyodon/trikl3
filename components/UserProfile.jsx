import React from "react";
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Avatar } from "@nextui-org/react";
import { signOut } from "next-auth/react";

const UserProfile = () => {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error("Logout error:", error);
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
          name="Don Artkins"
          size="sm"
          src="/assets/avatar.png"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">donartkins@gmail.com</p>
        </DropdownItem>
        <DropdownItem key="settings" href="/dashboard/account">My Account</DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfile;