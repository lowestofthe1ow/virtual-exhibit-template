export default function Welcome({ next }) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-10 text-center">

      <h1 className="text-3xl font-bold text-cyan-700 mb-4">
        Do you have what it takes to become a Digital Pioneer?
      </h1>

      <p className="text-gray-700 mt-4 mb-4 leading-relaxed">
        Now that you've explored the interactive museum, it's time to test your knowledge!
        <br />
        The gauntlet consists of:
      </p>

      <div className="grid grid-cols-2 gap-5 mb-10">

        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-xl">
            5 Rounds!
          </h3>

          <p>
            Different challenge every round.
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-xl">
            50 Points!
          </h3>

          <p>
            Become a Digital Pioneer.
          </p>
        </div>

      </div>

      <button
        onClick={next}
        className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-xl text-xl"
      >
        Start Challenge
      </button>

    </div>
  );
}