import React from "react";

const UserInfo = ({ imgUrl, name, userName }) => {
  return (
    <div className="grid grid-cols-2 gap-1 w-32">
      <img src={imgUrl} className="rounded-full w-12" alt="Avatar" />
      <div className="grid grid-rows-2 gap-0">
        <div className="font-semibold">{name}</div>
        <div className="text-gray-600">@{userName}</div>
      </div>
    </div>
  );
};

export default UserInfo;
