import { memo } from "react";
function Search({ onChange }) {
  console.log("Search re-rendered");
  return (
    <input
      type="text"
      placeholder="Search Users..."
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default memo(Search);

//Memo - "only re-renders" this if the props are actually different from one render to another or else skips the re-render.Here it checks the onChange prop
