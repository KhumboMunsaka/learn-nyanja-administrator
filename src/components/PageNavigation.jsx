import styles from "../styles/PageNavigation.module.css";

import { NavLink } from "react-router-dom";

function PageNavigation() {
  return (
    <ul className={styles.container}>
      <li>
        <NavLink to="lessons" className={styles.link}>
          Lessons
        </NavLink>
      </li>
      <li className={styles.link}>
        <NavLink to="mod" className={styles.link}>
          MOD
        </NavLink>
      </li>
      <li>
        <NavLink to="dictionary" className={styles.link}>
          Dictionary
        </NavLink>
      </li>
    </ul>
  );
}

export default PageNavigation;
