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
                    className="bg-pri rounded-full text-light_txt2 font-bold hover:bg-pri transition-all duration-400 ease-in-out"
                >
                    {name}
                </Button>
            ) : (
                <Link
                    href={route}
                    aria-label={name}
                    onClick={handleClick}
                    className={`text-light_txt font-bold hover:text-pri transition-all duration-400 ease-in-out ${isActive ? 'active' : ''}`}
                >
                    {name}
                </Link>
            )}
        </NavbarItem>
    );
}

export default NavItem;
