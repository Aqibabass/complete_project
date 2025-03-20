import { IoMdPerson } from "react-icons/io";
import { IoListSharp } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

function AccountNav() {
    const { pathname } = useLocation();
    let subpage = pathname.split('/')?.[2];

    function linkClasses(type = null) {
        if (subpage === undefined) {
            subpage = 'profile';
        }
        const isActive = pathname === '/account' && type === 'profile';
        let classes = 'inline-flex items-center gap-2 py-2 px-4 sm:py-3 sm:px-6 rounded-full text-sm sm:text-base';

        if (type === subpage) {
            classes += ' bg-primary text-white font-medium';
        } else {
            classes += ' bg-gray-200 text-gray-600';
        }

        return classes;
    }

    return (
        <nav className="w-full flex justify-center mt-8 gap-2 mb-6 items-center flex-wrap">
            <Link className={linkClasses('profile')} to={'/account'}>
                <IoMdPerson className="size-6" />
                <span className="hidden sm:block">My Profile</span>
            </Link>
            <Link className={linkClasses('bookings')} to={'/account/bookings'}>
                <IoListSharp className="size-6" />
                <span className="hidden sm:block">My Bookings</span>
            </Link>
            <Link className={linkClasses('places')} to={'/account/places'}>
                <RiHotelLine className="size-6" />
                <span className="hidden sm:block">My Accommodations</span>
            </Link>
        </nav>
    );
}

export default AccountNav;
