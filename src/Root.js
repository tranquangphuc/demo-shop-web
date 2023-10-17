import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet, useNavigation } from "react-router-dom";

function Root() {
  const navigation = useNavigation();
  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Demo Shop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/customers">
                <Nav.Link>Customers</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/shops">
                <Nav.Link>Shops</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/products">
                <Nav.Link>Products</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div id="detail" className="my-3">
        <Outlet />
      </div>
    </Container>
  );
}

export default Root;
