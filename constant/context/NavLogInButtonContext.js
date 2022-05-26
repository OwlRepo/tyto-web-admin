import { createContext, useRef, useState } from "react";

const NavLoginButtonContext = createContext({
  isLoggedIn: Boolean,
  handleLoggedInState: () => {},
});

export function NavLoginButtonContextProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  function handleLoggedInState() {
    setIsLoggedIn(!isLoggedIn);
  }

  const context = {
    isLoggedIn: isLoggedIn,
    handleLoggedInState: handleLoggedInState,
  };

  return (
    <NavLoginButtonContext.Provider value={context}>
      {props.children}
    </NavLoginButtonContext.Provider>
  );
}

export default NavLoginButtonContext;
