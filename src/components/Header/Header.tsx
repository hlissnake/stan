import React from "react";
import styled from "styled-components";
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
  width: 100%;
`;

const Logo = styled.a`
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

const NavItem = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-size: 1rem;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const NavLink: React.FC<NavItemProps> = ({ href, children }) => (
  <NavItem>
    <a href={href}>{children}</a>
  </NavItem>
);

const Header: React.FC = () => {
  return (
    <Bar>
      <Logo
        href="https://www.stan.com.au/"
        title="Stan."
        rel="home"
        data-event-target="header-logo"
      >
        <img src={logoSvg} alt="Stan Logo" />
      </Logo>

      <NavLinks>
        <NavLink href="#home">Home</NavLink>
        <NavLink href="#about">TV Shows</NavLink>
        <NavLink href="#services">Movies</NavLink>
      </NavLinks>
    </Bar>
  );
};

export default Header;
