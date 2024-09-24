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

  const StudentNavItems = () => (
    <>
      <NavItem route="/student-dashboard" name="Dashboard" activeItem={activeItem} />
      <NavItem route="/student-dashboard/attachments" name="Attachments" activeItem={activeItem} />
      <NavItem route="/student-dashboard/resources" name="Resources" activeItem={activeItem} />
    </>
  );

  const CompanyNavItems = () => (
    <>
      <NavItem route="/company-dashboard" name="Dashboard" activeItem={activeItem} />
      <NavItem route="/company-dashboard/attachments" name="Attachments" activeItem={activeItem} />
      <NavItem route="/company-dashboard/resources" name="Resources" activeItem={activeItem} />
    </>
  );

  const renderNavItems = () => {
    if (status === "authenticated") {
      return session.user.userType === "student" ? <StudentNavItems /> : <CompanyNavItems />;
    }
    return <LoggedOutNavItems />;
  };

  const getDashboardLink = () => {
    if (status === "authenticated") {
      return session.user.userType === "student" ? "/student-dashboard" : "/company-dashboard";
    }
    return "/";
  };

  return (
    <Navbar className="bg-sec py-3 px-4 md:px-8 lg:px-16">
      <div className="w-full flex justify-between items-center">
        <NavbarBrand className="flex-grow mr-40">
          <Link href={getDashboardLink()} className="text-light_txt">
            <Trikl3Logo />
            <p className="font-bold text-inherit text-xl">Trik<span className="text-pri">l3.</span></p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="flex-grow mx-4">
          {renderNavItems()}
        </NavbarContent>

        <NavbarContent className="flex-none ml-20">
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <NavItem
                route={`${session.user.userType === "student" ? "/student-dashboard" : "/company-dashboard"}/applications`}
                name={"View Applications"}
                isButton={true}
              />
              <UserProfile />
            </div>
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
      </div>
    </Navbar>
  );
}

export default Nav;