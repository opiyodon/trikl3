import React from "react";
import { Navbar, NavbarBrand, NavbarContent, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Input } from "@nextui-org/react";
import Trikl3Logo from "./Trikl3Logo";
import NavItem from "./NavItem";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchIcon from "./SearchIcon";

const Nav = () => {
  const [activeItem, setActiveItem] = useState("");

  const pathName = usePathname();

  useEffect(() => {
    if (pathName === "/") setActiveItem('/');
    if (pathName === "/internships") setActiveItem('/internships');
    if (pathName === "/resources") setActiveItem('/resources');
    if (pathName === "/events") setActiveItem('/events');
    if (pathName === "/post-internships") setActiveItem('/post-internships');
  }, [pathName]);

  return (
    <Navbar className="bg-sec shadow-lg">
      <NavbarBrand
        as={Link}
        href='/'
      >
        <Trikl3Logo />
        <p className="font-bold text-light_txt text-2xl">
          Trikl<span className="text-pri">3.</span>
        </p>
      </NavbarBrand>

      <NavbarContent
        as="div"
        className="items-center"
        justify="end"
      >
        <NavbarContent as="div" className="gap-7">
          <NavItem
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            route="/"
            name="Home"
          />
          <NavItem
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            route="/internships"
            name="Internships"
          />
          <NavItem
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            route="/resources"
            name="Resources"
          />
          <NavItem
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            route="/events"
            name="Events"
          />
          <NavItem
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            route="/post-internships"
            name="Post Internship"
          />
        </NavbarContent>

        <NavbarContent
          as="div"
        >
          <Input
            classNames={{
              base: "w-full h-10 rounded-full",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
            style={{ width: "200px", height: "40px" }}
          />
        </NavbarContent>

        <NavbarContent
          as="div"
        >
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </NavbarContent>


    </Navbar>
  )
}

export default Nav