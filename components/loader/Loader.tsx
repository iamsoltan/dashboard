import React from "react";

import styles from "./loader.module.scss";

const size = 6;
const Loader = () => (
  <div className={styles.loader}>
    <div className={styles.loader__dotContainer}>
      {Array.from({ length: size }, (elem, index) => (
        <span
          key={index}
          className={`${styles.loader__dot} ${styles[`loader__dot--${index}`]}`}
        />
      ))}
    </div>
  </div>
);

export default Loader;
