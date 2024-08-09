'use client'

import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, Link, Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Trikl3Logo from "./Trikl3Logo";
import NavItem from "./NavItem";
import UserProfile from "./UserProfile";

const Nav = () => {
  const [activeItem, setActiveItem] = useState("");
  const pathName = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    setActiveItem(pathName);
  }, [pathName]);

  useEffect(() => {
    const publicRoutes = ['/', '/about', '/services', '/contact', '/login', '/register', 'not-found'];
    if (status === "unauthenticated" && !publicRoutes.includes(pathName)) {
      router.push('/');
    }
  }, [status, router, pathName]);

  const LoggedOutNavItems = () => (
    <>
      <NavItem route="/" name="Home" activeItem={activeItem} />
      <NavItem route="/about" name="About" activeItem={activeItem} />
      <NavItem route="/services" name="Services" activeItem={activeItem} />
      <NavItem route="/contact" name="Contact" activeItem={activeItem} />
    </>
  );

  const LoggedInNavItems = () => (
    <>
      <NavItem route="/student-dashboard" name="Dashboard" activeItem={activeItem} />
      <NavItem route="/student-dashboard/attachments" name="Attachments" activeItem={activeItem} />
      <NavItem route="/student-dashboard/resources" name="Resources" activeItem={activeItem} />
      <NavItem route="/student-dashboard/events" name="Events" activeItem={activeItem} />
    </>
  );

  return (
    <Navbar className="bg-sec py-3">
      <NavbarBrand className="mr-52">
      {status === "authenticated" ? (
          <Link href="/student-dashboard" className="text-light_txt">
          <Trikl3Logo />
          <p className="font-bold text-inherit text-xl">Trik<span className="text-pri">l3.</span></p>
        </Link>
        ) : (
          <Link href="/" className="text-light_txt">
          <Trikl3Logo />
          <p className="font-bold text-inherit text-xl">Trik<span className="text-pri">l3.</span></p>
        </Link>
        )}
      </NavbarBrand>
      <NavbarContent className="gap-6 mr-52">
        {status === "authenticated" ? <LoggedInNavItems /> : <LoggedOutNavItems />}
      </NavbarContent>
      <NavbarContent className="justify-end">
        {status === "authenticated" ? (
          <>
            <NavItem route="/student-dashboard/applications" name="Apply for Attachment" isButton={true} />
            <UserProfile />
          </>
        ) : (
          <div className="flex justify-center gap-4">
            <Button as={Link} href="/register" className="btnPri">
              Register
            </Button>
            <Button as={Link} href="/login" className="btnSec">
              Login
            </Button>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
}

export default Nav;