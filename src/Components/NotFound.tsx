import React from "react";
import not_found from "../Assets/404.png";

interface NotFoundType {
  isNotFound: boolean;
}
const NotFound: React.FC<NotFoundType> = ({ isNotFound }) => {
  return (
    <div className={`not-found ${isNotFound && "active"}`}>
      <div className="box">
        <img src={not_found} alt="notFound" />
        <p>Oops! Location not found!</p>
      </div>
    </div>
  );
};

export default NotFound;
