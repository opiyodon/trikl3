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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  return (
    <>
      <Navbar className="bg-sec py-3 px-4 md:px-8 lg:px-16">
        <div className="w-full flex justify-between items-center">
          <NavbarBrand className="flex-grow mr-0 md:mr-40">
            <Link href={getDashboardLink()} className="text-light_txt">
              <Trikl3Logo />
              <p className="font-bold text-inherit text-xl">Trik<span className="text-pri">l3.</span></p>
            </Link>
          </NavbarBrand>

          <div className="hidden md:flex md:items-center md:justify-center md:space-x-4 md:flex-grow mx-4">
            {renderNavItems()}
          </div>

          <div className="hidden md:flex flex-none ml-20">
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
          </div>

          <button
            className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-full bg-white shadow-md menu-toggle-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300 ease-in-out"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none' }}
            >
              <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </Navbar>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden z-30 pt-16`}
      >
        <div className="p-4 pt-10">
          <div className="flex flex-col space-y-4">
            {renderNavItems()}
          </div>
          <div className="mt-8">
            {status === "authenticated" ? (
              <div className="flex flex-col items-center gap-4">
                <NavItem
                  route={`${session.user.userType === "student" ? "/student-dashboard" : "/company-dashboard"}/applications`}
                  name={"View Applications"}
                  isButton={true}
                />
                <UserProfile />
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-4">
                <Button as={Link} href="/register" className="btnPri w-full">
                  Register
                </Button>
                <Button as={Link} href="/login" className="btnSec w-full">
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
}

export default Nav;