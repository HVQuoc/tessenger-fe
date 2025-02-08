import Avatar from "./Avatar";
const Contact = ({isOnline, userId, username, selectedUserId, onClick}) => {
    return (
    <div
      key={userId}
      className={
        "flex items-center gap-2 border-b border-gray-100 cursor-pointer " +
        (userId === selectedUserId ? "bg-green-100" : "")
      }
      onClick={() => onClick(userId)}
    >
      {/* The online vertical bar */}
      {userId === selectedUserId && (
        <div className="w-1 h-12 bg-green-400 rounded-r-md"></div>
      )}
      <div className="flex pl-4 gap-2 py-2 items-center">
        <Avatar online={isOnline} userId={userId} username={username} />
        {/* <div className="w-8 h-8 opacity-60 text-center rounded-full bg-green-200">t</div> */}
        <span className="text-slate-600">{username}</span>
      </div>
    </div>
  );
};

export default Contact;
