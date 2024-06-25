'use client'

import React from "react";
import { Navbar, NavbarBrand, NavbarContent, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Nav = () => {
  const [activeItem, setActiveItem] = useState("");
  const pathName = usePathname();

  useEffect(() => {
    setActiveItem(pathName);
  }, [pathName]);

  const NavItem = ({ route, name, isButton = false }) => {
    const isActive = activeItem === route;
    if (isButton) {
      return (
        <Button as={Link} href={route} color="primary">
          {name}
        </Button>
      );
    }
    return (
      <Link 
        href={route}
        color={isActive ? "primary" : "foreground"}
        className={isActive ? "font-bold" : ""}
      >
        {name}
      </Link>
    );
  };

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/" color="foreground">
          <p className="font-bold text-inherit text-xl">Mara Labs</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavItem route="/internships" name="Internships" />
        <NavItem route="/resources" name="Resources" />
        <NavItem route="/events" name="Events" />
      </NavbarContent>

      <NavbarContent justify="end">
        <NavItem route="/post-internship" name="Post Internship" isButton={true} />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name="Jane Doe"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">jane@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings" href="/account">My Account</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}

export default Nav;