import { MdOutlineInventory } from "react-icons/md";
import { IoLogOutSharp } from "react-icons/io5";

const Header = () => {
    return (
        <div className="bg-[#4A4947] h-16 p-5 flex justify-between items-center text-[#FAF7F0]">
            <h1 className="flex items-center">
                Task Master <MdOutlineInventory className="ml-2" />
            </h1>
            <button className="flex items-center bg-[#B17457] p-2 rounded-lg">
                Logout <IoLogOutSharp className="ml-2" />
            </button>
        </div>

    )
}

export default Header