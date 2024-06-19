import { Link, NavbarItem } from '@nextui-org/react'
import React from 'react'

const NavItem = ({ activeItem, setActiveItem, route, name }) => {

    const isActive = activeItem === route; // Check if the link is active

    const handleClick = () => {
        setActiveItem(route); // Call setActiveItem with the route when clicked
    };

    return (
        <NavbarItem >
            <Link
                href={route}
                aria-label={name}
                onClick={handleClick}
                className={`text-black font-normal hover:text-purple-800 transition-all duration-400 ease-in-out ${isActive ? "active" : ""
                    }`}
            >
                {name}
            </Link>
        </NavbarItem>
    )
}

export default NavItem
