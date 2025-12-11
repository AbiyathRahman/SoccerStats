const SearchBar = ({ value, onChange, onSubmit, placeholder }) => {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search players...'}
      />
      <button type="submit" className="primary-btn">
        Search
      </button>
    </form>
  )
}

export default SearchBar
