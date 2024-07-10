'use client'

import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import Trikl3Logo from "./Trikl3Logo";
import NavItem from "./NavItem";
import UserProfile from "./UserProfile";

const Nav = () => {
  const [activeItem, setActiveItem] = useState("");
  const pathName = usePathname();

  useEffect(() => {
    setActiveItem(pathName);
  }, [pathName]);

  return (
    <Navbar className="bg-sec py-3">
      <NavbarBrand className="mr-52">
        <Link href="/" className="text-light_txt">
          <Trikl3Logo />
          <p className="font-bold text-inherit text-xl">Trik<span className="text-pri">l3.</span></p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="gap-6 mr-52">
        <NavItem route="/" name="Home" activeItem={activeItem} />
        <NavItem route="/attachments" name="Attachments" activeItem={activeItem} />
        <NavItem route="/resources" name="Resources" activeItem={activeItem} />
        <NavItem route="/events" name="Events" activeItem={activeItem} />
      </NavbarContent>
      <NavbarContent className="justify-end">
        <NavItem route="/post-attachments" name="Post Attachments" isButton={true} />
        <UserProfile />
      </NavbarContent>
    </Navbar>
  );
}

export default Nav;
