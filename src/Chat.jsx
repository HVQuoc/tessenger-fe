import { useContext, useEffect, useState } from "react";
import Avatar from "./components/Avatar";
import { UserContext } from "./UserContext";
import axios from "axios";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, id } = useContext(UserContext);

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const newWs = new WebSocket("ws://localhost:4000");
    setWs(newWs);
    newWs.addEventListener("message", handleMessage);
    newWs.addEventListener("close", () => connectToWs());
  }

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
    console.log("message data", messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  const onlinePeopleExcludeCurUser = { ...onlinePeople };
  delete onlinePeopleExcludeCurUser[id];

  function sendMessage(ev) {
    ev.preventDefault();

    // send to ws server
    ws.send(
      JSON.stringify({
        message: {
          recipient: selectedUserId,
          text: newMessage,
        },
      })
    );
    setNewMessage("");

    // add to current messages state 
    setMessages((prev) => [
      ...prev,
      { text: newMessage, recipient: selectedUserId, sender: id },
    ]);
  }

  // Load message with selected user
  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId)
    }
  }, [selectedUserId])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-white w-1/3">
        {/* Logo in the sidebar */}
        <div className="text-blue-400 font-bold text-xl mb-4 flex gap-2 items-center p-4">
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
        {Object.keys(onlinePeopleExcludeCurUser).map((userId) => {
          return (
            <div
              key={userId}
              className={
                "flex items-center gap-2 border-b border-gray-100 cursor-pointer " +
                (userId === selectedUserId ? "bg-green-100" : "")
              }
              onClick={() => setSelectedUserId(userId)}
            >
              {/* The online vertical bar */}
              {userId === selectedUserId && (
                <div className="w-1 h-12 bg-green-400 rounded-r-md"></div>
              )}
              <div className="flex pl-4 gap-2 py-2 items-center">
                <Avatar userId={userId} username={onlinePeople[userId]} />
                {/* <div className="w-8 h-8 opacity-60 text-center rounded-full bg-green-200">t</div> */}
                <span className="text-slate-600">{onlinePeople[userId]}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-100 w-2/3 p-2 flex flex-col">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="text-gray-400 text-xl h-full flex items-center justify-center">
              &larr; Select a person to chat
            </div>
          )}

          {/* display messages */}
          {!!selectedUserId && (
            // wrapper of the scroller
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute inset-0 bottom-2">
                {messages.map((m) => (
                  <div className={m.sender === id ? "text-right" : "text-left"}>
                    <div
                      className={
                        "p-2 my-2 inline-block text-left rounded-md " +
                        (m.sender === id
                          ? "bg-blue-400 text-white"
                          : "bg-white")
                      }
                    >
                      {m.text} <br />
                      {m.sender} <br />
                      {m.recipient}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New message input field */}
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              value={newMessage}
              onChange={(ev) => setNewMessage(ev.target.value)}
              type="text"
              className="bg-white rounded-sm outline-none p-2 flex-grow"
              placeholder="Type message"
            />
            <button
              type="submit"
              className="bg-blue-500 rounded-sm text-white p-2 outline-slate-300"
            >
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
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
