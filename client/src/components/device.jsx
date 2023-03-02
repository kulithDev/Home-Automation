function Device({ name,id }) {
  return (
    <div className="rounded-lg  border-2 border-white bg-black p-2" id={id}>
      <h1 className="text-xl text-white">{name}</h1>
      <h1 className="mt-2 text-4xl text-white font-bold">OFF</h1>
    </div>
  );
}

export default Device;
