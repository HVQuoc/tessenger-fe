import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import Contact from "./components/Contact";
import Tooltip from "./components/Tooltip";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const messageBoxBottomRef = useRef();

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const newWs = new WebSocket("ws://localhost:4000");
    setWs(newWs);
    newWs.addEventListener("message", handleMessage);
    newWs.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to reconnect to ws...");
        connectToWs();
      }, 2000);
    });
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

    if (!newMessage) {
      console.log("Cannot send the empty message string");
      return;
    }
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
      {
        text: newMessage,
        recipient: selectedUserId,
        sender: id,
        _id: Date.now(),
      },
    ]);
  }

  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }

  // Auto scroll to the bottom of the message box with smooth behavior
  useEffect(() => {
    const div = messageBoxBottomRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Load message with selected user
  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((response) => {
        setMessages(response.data);
      });
    }
  }, [selectedUserId]);

  // handle the offline people changes
  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id) // exclude the current user
        .filter((p) => !Object.keys(onlinePeople).includes(p._id)); // exclude online people

      // map the array of offline people to object key:value
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p.username;
      });

      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-white lg:w-1/4 w-1/3 flex flex-col">
        <div className="flex-grow">
          {/* Logo in the sidebar */}
          <div className="text-blue-400 font-bold text-xl mb-4 flex gap-2 items-center p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none  "
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
              <Contact
                isOnline={true}
                userId={userId}
                username={onlinePeopleExcludeCurUser[userId]}
                selectedUserId={selectedUserId}
                onClick={setSelectedUserId}
              />
            );
          })}

          {/* Display the list of offline people */}
          {Object.keys(offlinePeople).map((userId) => {
            return (
              <Contact
                isOnline={false}
                userId={userId}
                username={offlinePeople[userId]}
                selectedUserId={selectedUserId}
                onClick={setSelectedUserId}
              />
            );
          })}
        </div>
        <div className="p-2 mx-2 text-start flex items-center justify-between gap-2">
          <div className="flex gap-2 items-center">
            <div className="bg-gray-200 p-1 rounded-full overflow-hidden text-gray-600 border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <span>{username}</span>
          </div>
          <Tooltip text={"Logout"}>
            <button
              onClick={logout}
              className="bg-gray-200 rounded-md border p-1 text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="bg-blue-100 lg:w-3/4 w-2/3 p-2 flex flex-col">
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
              <div className="overflow-y-scroll absolute inset-0 bottom-2 pr-2">
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className={
                      "mb-2 " +
                      (m.sender === id ? "text-right ml-8" : "text-left mr-8")
                    }
                  >
                    <div
                      className={
                        "p-2 inline-block text-left rounded-md " +
                        (m.sender === id
                          ? "bg-blue-400 text-white"
                          : "bg-white")
                      }
                    >
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messageBoxBottomRef}></div>
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
