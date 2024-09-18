import React from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import NavbarLink from "../../data/navbar-links";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center  justify-center border-b-[1px] border-b-richblack-700">
      <div className=" flex w-11/12 max-w-maxContent items-center justify-between">
        {/* logo */}
        <Link to="/">
          <img src={logo} alt="" width={160} height={42} loading="lazy" />
        </Link>

        {/* navlinks */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLink.map((link, index) => (
              <li key={index}>
                <Link to={link.url} className="hover:text-richblack-100">
                  {link.title === "Catalog" ? (
                    <div>
                      <Link>Catalog</Link>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                      {/* jo tum path bhj rhe ho and jis current location pr tum abhi khade ho.. wo agar match kr jaye.. toh usko kr do yellow. baki sab white */}
                    </Link>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* login/signup/dashboard */}
        <div className="flex gap-x-4 items-center">
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
