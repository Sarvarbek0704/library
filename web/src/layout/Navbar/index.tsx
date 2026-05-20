import { NavbarWrap, NavbarInner, Right } from "./Navbar.styled";
import UserMenu from "../../pages/UserMenu/UserMenu";

export default function Navbar() {
  return (
    <NavbarWrap>
      <NavbarInner>
        <Right>
          <UserMenu />
        </Right>
      </NavbarInner>
    </NavbarWrap>
  );
}
