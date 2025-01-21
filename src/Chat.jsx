import { useEffect, useState } from "react";
import Avatar from "./components/Avatar";
const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  useEffect(() => {
    const newWs = new WebSocket("ws://localhost:4000");
    setWs(newWs);
    newWs.addEventListener("message", handleMessage);
  }, []);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });

    // console.log(people)
    setOnlinePeople(people);
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    // whenever the client connect to the ws server,
    // they would receive an array of online users
    // then we need to display it
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  }
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-white w-1/3 py-2 px-4">
        {/* Logo in the sidebar */}
        <div className="text-blue-400 font-bold text-xl mb-4 flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          <span>Tessenger</span>
        </div>

        {/* Display the list of online people */}
        {Object.keys(onlinePeople).map((userId) => {
          return (
            <div
              key={userId}
              className="flex items-center gap-2 border-b border-gray-100 py-2"
            >
              <Avatar userId={userId} username={onlinePeople[userId]} />
              <span>{onlinePeople[userId]}</span>
            </div>
          );
        })}
      </div>

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
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
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
