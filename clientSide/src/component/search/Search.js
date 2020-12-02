import React, { useContext } from "react";
import "antd/dist/antd.css";
import { Input } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import Context from "../Context";

function Search() {
  const { Search } = Input;
  const { setUserSearch } = useContext(Context);

  return (
    <div>
      <Search
        placeholder="הכנס טקסט לחיפוש"
        enterButton="חפש"
        size="large"
        onSearch={(value) => setUserSearch(value)}
        dir="rtl"
      />
    </div>
  );
}
export default Search;
