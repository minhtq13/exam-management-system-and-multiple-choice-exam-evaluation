import { Input, Select } from "antd";
import "./SearchFilter.scss";

const SearchFilter = ({ placeholder, displayFilter, onSearch, options, onChange, onSelect }) => {
  return (
    <div className="list-search-filter">
      <div className="list-search">
        <span className="list-search-filter-label">Tìm kiếm:</span>
        <Input.Search placeholder={placeholder} enterButton onSearch={onSearch} allowClear onChange={onChange} />
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
            onChange={onSelect}
          />
        </div>
      )}
    </div>
  )
}
export default SearchFilter;
