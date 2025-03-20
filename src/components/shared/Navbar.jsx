import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UserIcon, BadgeRussianRuble, Handshake } from "lucide-react";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const location = useLocation();

  const memberId = sessionStorage.getItem("memberId");

  const allowedPaths = ["/member-dashboard", `/member-loan/${memberId}`, "/member-transactions", "/member-profile"];
  

  const isNavbarVisible = allowedPaths.includes(location.pathname);

  if (!isNavbarVisible) return null; 

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 mb-5 z-[1000]">
      <nav className="rounded-[30px] bg-gray-200 shadow-lg p-2 flex justify-around items-center border-t">
        <Link to="/member-dashboard" onClick={() => setActive("home")} className={`flex flex-col items-center ${active === "home" ? "text-green-600" : "text-gray-500"}`}>
          <HomeIcon size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link to={`/member-loan/${memberId}`} 
           onClick={() => setActive("loan")} className={`relative flex flex-col items-center ${active === "loan" ? "text-green-600" : "text-gray-500"}`}>
          <Handshake size={24} />
          <span className="text-xs">Loan</span>
        </Link>
        <Link to="/member-transactions" onClick={() => setActive("transactions")} className={`flex flex-col items-center ${active === "transactions" ? "text-green-600" : "text-gray-500"}`}>
          <BadgeRussianRuble size={24} />
          <span className="text-xs">Transaction</span>
        </Link>
        <Link to="/member-profile" onClick={() => setActive("profile")} className={`flex flex-col items-center ${active === "profile" ? "text-green-600" : "text-gray-500"}`}>
          <UserIcon size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
