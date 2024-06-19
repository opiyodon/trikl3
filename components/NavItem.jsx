import { Button, Link, NavbarItem } from '@nextui-org/react';
import React from 'react';

const NavItem = ({ activeItem, setActiveItem, route, name }) => {
    const isActive = activeItem === route;

    const handleClick = () => {
        setActiveItem(route);
    };

    return (
        <NavbarItem>
            {route === '/post-internships' ? (
                <Button
                    as={Link}
                    href={route}
                    aria-label={name}
                    onClick={handleClick}
                    className="bg-purple-800 rounded-full text-white font-bold hover:bg-purple-800 transition-all duration-400 ease-in-out"
                >
                    {name}
                </Button>
            ) : (
                <Link
                    href={route}
                    aria-label={name}
                    onClick={handleClick}
                    className={`text-black font-bold hover:text-purple-800 transition-all duration-400 ease-in-out ${isActive ? 'active' : ''}`}
                >
                    {name}
                </Link>
            )}
        </NavbarItem>
    );
}

export default NavItem;
