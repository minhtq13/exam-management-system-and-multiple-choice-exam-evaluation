import { Input, Select } from "antd";
import "./SearchFilter.scss";

const SearchFilter = ({ placeholder, displayFilter, onSearch, options }) => {
  return (
    <div className="list-search-filter">
      <div className="list-search">
        <span className="list-search-filter-label">Tìm kiếm:</span>
        <Input.Search placeholder={placeholder} enterButton />
      </div>
      {displayFilter && (
        <div className="list-filter">
          <span className="list-search-filter-label">Khóa:</span>
          <Select
            mode="multiple"
            placeholder="Chọn khóa"
            showSearch
            allowClear
            onSearch={onSearch}
            options={options}
          />
        </div>
      )}
    </div>
  )
}
export default SearchFilter;
