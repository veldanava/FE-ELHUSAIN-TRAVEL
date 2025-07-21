"use client";

const FloatingButton = () => {
  return (
    <div className="fixed bottom-5 right-5 z-10">
      <button className="bg-amber-800 hover:bg-amber-800 text-white font-bold py-3 px-4 rounded-full shadow-lg transition duration-300">
        <a href="#contact">Hubungi Kami</a>
      </button>
    </div>
  );
};

export default FloatingButton;
