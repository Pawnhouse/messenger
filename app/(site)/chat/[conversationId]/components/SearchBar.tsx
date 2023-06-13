const SearchBar = ({ searchValue, setSearchValue }: { searchValue: string, setSearchValue: (value: string) => void }) => {

  return (
    <div className='flex items-center gap-2 lg:gap-4 max-w-screen-md mx-auto'>
      <input
        autoFocus
        value={searchValue}
        placeholder={'Search'}
        onChange={e => setSearchValue(e.target.value)}
        className='
          text-black
          font-light
          py-2
          px-4
          bg-neutral-100 
          w-full 
          rounded-full
          focus:outline-none
        '
      />
    </div>
  );
}

export default SearchBar;