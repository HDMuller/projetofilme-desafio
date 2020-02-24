import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink, NavbarText } from 'reactstrap';
import './navbar.css'

const NavbarGlobal = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const logout = () => {
        localStorage.removeItem('ProjetoFilmeAutenticado');
    }

    return (
        <div>
            <Navbar light expand="md">
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar>
                        <NavItem className={props.ativo == 'films' ? 'active' : ''}>
                            <NavLink href="/films">Filmes</NavLink>
                        </NavItem>
                        <NavItem className={props.ativo == 'genres' ? 'active' : ''}>
                            <NavLink href="/genres">Gêneros</NavLink>
                        </NavItem>
                        <NavItem className={props.ativo == 'leases' ? 'active' : ''}>
                            <NavLink href="/leases">Locações</NavLink>
                        </NavItem>
                    </Nav>
                    <NavLink href="/" onClick={logout}>Sair</NavLink>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default NavbarGlobal;