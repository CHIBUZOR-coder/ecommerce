const Input = ({ type, value, change, name, placeholder }) => {
  return (
    <div>
      <input
      className="w-full p-2 rounded-md bg-transparent border-[1px] border-white outline-none"
        type={type}
        value={value}
        onChange={change}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
