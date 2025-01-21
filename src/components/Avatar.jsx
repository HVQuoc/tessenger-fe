
const Avatar = ({userId, username}) => {
  return (<div className="w-8 h-8 bg-blue-500 rounded-full" >
    <div className="text-white text-center">{username[0]}</div>
  </div>)
}

export default Avatar
