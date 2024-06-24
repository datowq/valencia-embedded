const StartScreen = ({ startGame, setStartGame }) => {
  return (
    !startGame && (
      <div className="z-10 text-8xl text-black bg-white select-none flex flex-col w-full h-full font-chronotype justify-center items-center text-center">
        <div>resume world</div>
        <button className="text-4xl" onClick={() => setStartGame(true)}>
          start
        </button>
      </div>
    )
  );
};
export default StartScreen;
