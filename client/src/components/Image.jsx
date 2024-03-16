import React from "react";

const Image = ({ url, styles }) => {
  return <img src={url} className={styles} />;
};

export default Image;
