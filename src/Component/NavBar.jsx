
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHouse} from '@fortawesome/free-solid-svg-icons'
import {faListUl} from '@fortawesome/free-solid-svg-icons'
import {faGear} from '@fortawesome/free-solid-svg-icons'
import TrackrAidLogo from "./TrackrAidLogo";

function NavBar() {
   
    return(
        <>
      <nav className="bottom-0 h-15 items-center fixed w-full border-t bg-[#f2f2f2] flex justify-between px-5 text-gray-600 text-[18px] dark:bg-gray-900 lg:hidden">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-black dark:text-white" : "text-gray-600 "}><FontAwesomeIcon icon={faHouse} /></NavLink>
                <NavLink to="/transactions" className={({ isActive }) => isActive ? "text-black dark:text-white" : "text-gray-600 "}><FontAwesomeIcon icon={faListUl} /></NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? "text-black dark:text-white" : "text-gray-600 "}><FontAwesomeIcon icon={faGear} /></NavLink>               
       </nav>
        <nav className="hidden lg:flex flex-col absolute w-[24%] h-[100%] pt-8 pl-3  bg-[#f2f2f2] text-gray-600 text-[18px] dark:bg-gray-900 gap-12 rounded-r-2xl">
                    <TrackrAidLogo variant="full" size={36} />
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-black text-[22px] flex gap-3 w-full rounded-l-lg bg-[#2563eb] p-2  dark:text-white" : "text-gray-600 text-[22px] pl-2 flex gap-3 "}><FontAwesomeIcon icon={faHouse} className="mt-1" /> <span>Dashboard</span></NavLink>
                <NavLink to="/transactions" className={({ isActive }) => isActive ? "text-black text-[22px] flex gap-3 w-full rounded-l-lg bg-[#2563eb] p-2  dark:text-white" : "text-[22px] pl-2 text-gray-600 flex gap-3 "}><FontAwesomeIcon icon={faListUl} className="mt-1" /><span>Transactions</span> </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? "text-black text-[22px] flex gap-3 w-full rounded-l-lg bg-[#2563eb] p-2  dark:text-white" : "text-[22px] pl-2 text-gray-600 flex gap-3 "}><FontAwesomeIcon icon={faGear}  className="mt-1"/> <span>Settings</span></NavLink>               
       </nav>
        </>
    );
}
export default NavBar;