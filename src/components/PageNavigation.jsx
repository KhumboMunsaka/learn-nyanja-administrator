import { NavLink } from "react-router-dom";

function PageNavigation() {
  return (
    <ul>
      <li>
        <NavLink to="lessons">Lessons</NavLink>
      </li>
      <li>
        <NavLink to="mod">MOD</NavLink>
      </li>
      <li>
        <NavLink to="dictionary">Dictionary</NavLink>
      </li>
    </ul>
  );
}

export default PageNavigation;
