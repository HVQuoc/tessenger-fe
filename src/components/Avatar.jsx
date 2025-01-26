const Avatar = ({ userId, username }) => {
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-teal-200",
    "bg-pink-200"
  ];

  const userIdBase10 = parseInt(userId, 12);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={"w-8 h-8 flex items-center rounded-full " + color}>
      <div className="text-center w-full opacity-60">{username[0]}</div>
    </div>
  );
};

export default Avatar;
