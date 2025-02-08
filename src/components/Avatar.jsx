const Avatar = ({ userId, username, online }) => {
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-teal-200",
    "bg-pink-200"
  ];

  // set the color for the avatar's bg
  const userIdBase10 = parseInt(userId, 12);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  // color for online indicator
  const onlineIndicatorColor = online? "bg-green-600" : "bg-gray-600";

  return (
    <div className={"relative w-8 h-8 flex items-center rounded-full " + color}>
      <div className="text-center w-full opacity-60">{username[0]}</div>
      <div className={"absolute w-3 h-3 border border-white bottom-0 right-0 rounded-full " + onlineIndicatorColor} ></div>
    </div>
  );
};

export default Avatar;
