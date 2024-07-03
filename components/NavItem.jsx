import React from "react";
import { Link, Button } from "@nextui-org/react";

const NavItem = ({ route, name, isButton = false, activeItem }) => {
  const isActive = activeItem === route;

  if (isButton) {
    return (
      <Button as={Link} href={route} className="btnPri">
        {name}
      </Button>
    );
  }

  return (
    <Link
      href={route}
      className={`transition duration-300 ease-in-out ${
        isActive ? "font-bold text-pri" : "text-light_txt"
      }`}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pri)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "var(--pri)" : "var(--light_txt)")}
    >
      {name}
    </Link>
  );
};

export default NavItem;
