import { useAppStore } from "@/stores";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { colors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiclient from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, Host, UPDATE_PROFILE_ROUTE } from "@/utils/constant";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [image, setImage] = useState(userInfo?.image || null);
  const [hover, setHover] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);


  useEffect(() => {
   
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName)
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if(userInfo.image){
      setImage(`${Host}/${userInfo.image}`);
    }
    
  }, [userInfo])
  

  const validateProfile = ()=>{
    if(!firstName){
      toast.error("firstName is required")
      return false;
    }
    if(!lastName){
      toast.error("LastName is required")
      return false;
    }
    return true;
  }
  

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiclient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor }, 
          { withCredentials: true }
        );
  
        if (response.status === 200 && response.data) {
          setUserInfo(response.data); // Use API response to update user info
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(error.response?.data?.error || "Failed to update profile");
      }
    }
  };
  
 const handleImageClick = () => {
  if (image) {
    setImage(null); // Remove the image
  } else {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => { // ✅ Make this function async
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profile-image", file);

        try {
          const response = await apiclient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true }); // ✅ Use await here
          
          if (response.status === 200 && response.data.image) {
            setUserInfo({ ...userInfo, image: response.data.image });
            toast.success("Image updated successfully");
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          toast.error("Failed to upload image");
        }
      }
    };
    fileInput.click();
  }
};


  if (!userInfo) {
    return <div>Loading profile...</div>; // Handle the case where user data isn't available
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hover && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full ring-fuchsia-50">
                {image ? (
                  <FaTrash
                    className="text-white text-3xl cursor-pointer"
                    onClick={handleImageClick}
                  />
                ) : (
                  <FaPlus
                    className="text-white text-3xl cursor-pointer"
                    onClick={handleImageClick}
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <input
                type="email"
                placeholder="Email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index} // Move the key here
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
        ${selectedColor === index ? "outline outline-white/50 outline-1" : ""}`}
                  onClick={() => setSelectedColor(index)} // Use the setter function to update the selected color
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full ">
              <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>
                Save Changes
              </Button>
      </div>
      </div>
      
    </div>
  );
};

export default Profile;
