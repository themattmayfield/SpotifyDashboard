import Pop from "./Popover";

export default function Default(props) {
  return (
      <header className="flex justify-end md:justify-between px-2 py-4 md:p-6">
        <input
          placeholder="Search..."
          type="search"
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
          className="hidden md:block rounded-full focus:outline-none border border-[#383838] bg-custom-darkgray text-white px-4 md:px-12 py-2 text-lg md:text-3xl w-8/12 h-10 md:h-16"
        />

        <Pop popIsOpen={props.popIsOpen} setPopIsOpen={props.setPopIsOpen} />
      </header>
  );
}
