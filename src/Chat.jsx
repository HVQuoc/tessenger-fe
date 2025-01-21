import React from "react";

const Chat = () => {
  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">contacts</div>
      <div className="bg-blue-100 w-2/3 p-2 flex flex-col">
        <div className="flex-grow">Messages</div>
        <div className="flex gap-2">
          <input
            type="text"
            className="bg-white rounded-sm outline-none p-2 flex-grow"
            placeholder="Type message"
          />    
          <button className="bg-blue-500 rounded-sm text-white p-2 outline-slate-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
