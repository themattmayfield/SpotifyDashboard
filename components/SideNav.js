import { SiSpotify } from 'react-icons/si';
import {AiFillHome} from 'react-icons/ai'
import {GiMicrophone} from 'react-icons/gi'
export default function SideNav(props) {
    return (
        <div className="rounded-xl p-4 w-32 h-full flex flex-col space-y-6 items-center pt-12">
            <div className="mb-12">
            <SiSpotify className="w-14 h-14 text-green-600" />
            </div>
            <div className="flex flex-col space-y-12 items-center">
            <AiFillHome className="w-6 h-6 text-white" />
            <GiMicrophone className="w-6 h-6 text-white" />
            </div>
            </div>
    )
}