import Lottie from "lottie-react";
import { animationDefaultOptions } from "@/lib/utils";
// console.log(animationDefaultOptions)

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-300 transition-all">
     <Lottie 
     
     height={200}
     width={200}
     animationData = {animationDefaultOptions.animationData}
     />
     <div className="text-poacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
            Hi<span className="text-purple-500">!</span>
            <span className="text-purple-500"> ChatEase</span> Chat App
            <span className="text-purple-500"> .</span>
        </h3>
     </div>
    </div>
  )
}

export default EmptyChatContainer;
