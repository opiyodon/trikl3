import React from "react";
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Avatar } from "@nextui-org/react";

const UserProfile = () => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="#5F3D8C"
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
        <DropdownItem key="settings" href="/account">My Account</DropdownItem>
        <DropdownItem key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfile;
