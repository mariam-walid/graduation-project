import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useSession, signOut } from "next-auth/react";

function NavBar() {
  const { status } = useSession();

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="fixed-top">
        <Container>
          <Navbar.Brand href="/">Enabledu</Navbar.Brand>
          <Nav className="me-auto">
            {status === "authenticated" && (
              <>
                <Nav.Link href="/qna">QnA</Nav.Link>
                <Nav.Link href="/assignments">Assignments</Nav.Link>
                <Nav.Link href="/timeTracker">Time-Tracker</Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="me-auto">
            {status === "unauthenticated" && (
              <>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login">Log In</Nav.Link>
              </>
            )}
            {status === "authenticated" && (
              <Nav.Link
                onClick={() =>
                  signOut({ callbackUrl: "http://localhost:3000/" })
                }
              >
                Log out
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
