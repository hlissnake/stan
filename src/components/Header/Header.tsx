import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { NavItemProps } from "../../types";
import logoSvg from "@images/svg/logo.svg";

const Bar = styled.header`
  align-items: center;
  display: flex;
  height: 5rem;
  justify-content: flex-start;
  gap: 5rem;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
  padding-left: var(--layout-gutter);
  padding-right: var(--layout-gutter);

  @media (min-width: 1920px) {
    width: var(--layout-max-width);
    margin: 0 auto;
  }
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;

  img {
    height: 2rem;
    width: auto;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  font-weight: 700;
`;

const NavItem = styled.li<{ isActive?: boolean }>`
  a {
    color: ${props => props.isActive ? 'white' : 'var(--colour-white-20)'};
    text-decoration: none;
    font-size: 1.5rem;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const NavLink: React.FC<NavItemProps> = ({ href, children }) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  
  return (
    <NavItem isActive={isActive}>
      <Link to={href}>{children}</Link>
    </NavItem>
  );
};

const Header: React.FC = () => {
  return (
    <Bar>
      <Logo
        to="/"
        title="Stan."
        data-event-target="header-logo"
      >
        <img src={logoSvg} alt="Stan Logo" />
      </Logo>

      <NavLinks>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/tv-shows">TV Shows</NavLink>
        <NavLink href="/movies">Movies</NavLink>
      </NavLinks>
    </Bar>
  );
};

export default Header;
