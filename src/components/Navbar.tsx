import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import Container from "./Container";
import Link from "next/link";
import { auth, logout } from "../utils/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect } from "react";
const Navbar = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user);
      } else {
        setUserData(null);
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <nav className="py-8 bg-gray-800">
      <Container>
        <GiHamburgerMenu
          className="text-3xl cursor-pointer lg:hidden"
          onClick={() => {
            setIsMenuOpen(true);
          }}
        />

        <div
          className={`absolute flex flex-col items-center justify-center bg-gray-800 w-screen h-screen z-50 top-0 left-0 p-4 gap-4 ${
            isMenuOpen ? "lg:translate-y-0" : "-translate-y-full"
          } transition-all duration-500 lg:static lg:h-auto lg:flex-row lg:translate-y-0 lg:p-0 lg:gap-0 lg:justify-between lg:w-auto`}
        >
          <AiOutlineClose
            className="text-3xl cursor-pointer lg:hidden absolute top-8 left-4"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          />
          <div className="text-center">
            <Link
              href="/"
              className="text-3xl font-semibold"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              Home
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-3xl flex-col lg:flex-row">
            {userData ? (
              <>
                <h2
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  {userData.email}
                </h2>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};
export default Navbar;
