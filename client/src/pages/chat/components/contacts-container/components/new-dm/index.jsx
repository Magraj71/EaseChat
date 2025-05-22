import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Lottie from "lottie-react";
import { animationDefaultOptions } from "@/lib/utils";
import apiclient from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constant";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/stores";

const Host = "http://localhost:8747"; // Define your API or server URL

const NewDM = () => {
  const {setSelectedChatType,setSelectedChatData} =useAppStore()
  const [openNewContactModal, setopenNewContactModal] = useState(false);
  const [searchedContact, setsearchedContact] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchContacts = async (searchTerm) => {
    setIsLoading(true);
    try {
      if (searchTerm.length > 0) {
        const response = await apiclient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setsearchedContact(response.data.contacts);
          setErrorMessage("");
        }
      } else {
        setsearchedContact([]);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while fetching contacts.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectNewContact = (contact)=>{
    setopenNewContactModal(false)
    setSelectedChatType("contact")
    setSelectedChatData(contact)
    setsearchedContact([])
  }
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger tabIndex="0">
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setopenNewContactModal(true)}
              aria-label="Select New Contact"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setopenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[450px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select a New Contact</DialogTitle>
            <DialogDescription>Search for your contacts below</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <input
              id="contact-search"
              type="text"
              placeholder="Search Contacts"
              className="rounded-lg p-3 bg-[#2c2e3b] w-full border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
            {/* <button
              onClick={() => {
                setsearchedContact([]);
                document.getElementById("contact-search").value = "";
              }}
              className="text-neutral-400"
            >
              Clear
            </button> */}
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}

          <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
            <div className="flex flex-col gap-5">
              {searchedContact.map((contact) => (
                <div key={contact._id} className="flex gap-3 items-center cursor-pointer"
                onClick={()=>selectNewContact(contact)}>
                  <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                    {contact.image ? (
                      <AvatarImage
                        src={`${Host}/${contact.image}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                      />
                    ) : (
                      <div
                        className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center ${getColor(contact.color)}`}
                      >
                        {contact.firstName
                          ? contact.firstName.split("").shift()
                          : contact.email.split("").shift()}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {isLoading ? (
            <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-300 transition-all">
              <div className="w-full h-[200px]">
                <div className="spinner"></div>
              </div>
            </div>
          ) : searchedContact.length <= 0 && (
            <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-300 transition-all">
              <div className="w-full h-[200px]">
                <Lottie
                  animationData={animationDefaultOptions.animationData}
                  className="h-[200px]"
                />
              </div>
              <div className="text-opacity-80 text-white flex flex-col gap-3 items-center lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span>
                  <span className="text-purple-500"> Search New</span> Contacts
                  <span className="text-purple-500">.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
