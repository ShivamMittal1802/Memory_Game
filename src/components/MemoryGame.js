import React, { useEffect, useState } from "react";

const MemoryGame = () => {
  const [list, setList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [matched, setMatched] = useState([]);
  const [gridSize, setGridSize] = useState(4);
  const [flipped, setFlipped] = useState([]);
  const [open, setOpen] = useState({});
  const [won, setWon] = useState("");

  useEffect(() => {
    const total_box = gridSize * gridSize;
    const newList = Array(Math.floor((total_box + 1) / 2) * 2)
      .fill()
      .map((item, ind) => {
        return { id: ind, value: Math.floor(ind / 2) };
      })
      .sort(() => Math.random() - 0.5);
    console.log(newList);

    setList(newList);
    setDisabled(false);
    setMatched([]);
    setFlipped([]);
    setWon("");
    setOpen({});
  }, [gridSize]);

  const handleGridInputChange = (e) => {
    if (e.target.value <= 0) return;
    setGridSize(e.target.value);
  };

  const findValue = (ind) => {
    const val = list.filter((obj) => {
      return obj.id === ind;
    });

    return val[0].value;
  };

  const findIndex = (ind) => {
    let ansInd;
    list.forEach((item, index) => {
      if (item.id === ind) {
        ansInd = index;
      }
    });
    return ansInd;
  };

  const handleBoxClick = (item, ind) => {
    console.log("matched", matched);

    if (disabled) return;

    if (matched.includes(item.id)) {
      return;
    }

    setOpen((prev) => {
      if (open[ind]?.isOpen) {
        return {
          ...prev,
          [ind]: { isOpen: false },
        };
      } else {
        return { ...prev, [ind]: { isOpen: true } };
      }
    });
    if (flipped.length === 0) {
      console.log(findIndex(item.value));
      setFlipped([item.id]);
      return;
    }
    if (flipped.length === 1 && flipped[0] === item.id) {
      setFlipped([]);
      return;
    }
    if (flipped.length === 1) {
      const secondIndex = item.id;
      const firstValue = findValue(flipped[0]); //correct value
      const secondValue = findValue(secondIndex); //correct value

      if (firstValue === secondValue) {
        setMatched((prev) => {
          const newArr = [...prev, flipped[0], secondIndex];
          console.log("newArr", newArr);
          if (newArr.length === list.length && newArr) {
            setWon(true);
          }
          return newArr;
        });
      } else {
        setTimeout(() => {
          setOpen((prev) => {
            return {
              ...prev,
              [ind]: { isOpen: false },
              [findIndex(flipped[0])]: { isOpen: false },
            };
          });
          setDisabled(false);
        }, 1000);
        setDisabled(true);
      }
      setFlipped([]);
    }
  };

  return (
    <div>
      <div className=" flex justify-center text-center">
        Grid Size:{" "}
        <input
          className="ml-2 w-8"
          type="number"
          value={gridSize}
          onChange={(e) => handleGridInputChange(e)}
        />
      </div>
      <div className="text-center font-bold text-black text-3xl mb-4">
        Memory Game

      </div>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {list.map((item, ind) => {
          const boxStyle = !matched.includes(item.id)
            ? !open[ind]?.isOpen
              ? { backgroundColor: "blue" }
              : { backgroundColor: "" }
            : { backgroundColor: "green" };
          return (
            <div
              className=" rounded-lg flex justify-center items-center w-10 h-10 bg-slate-500"
              key={item.id}
              style={boxStyle}
              onClick={() => handleBoxClick(item, ind)}
            >
              {!open[ind]?.isOpen ? "" : item.value}
            </div>
          );
        })}
      </div>
      {won && <div className="text-center font-bold text-red-700 text-3xl mb-4"> Yeah! You Won </div>}
    </div>
  );
};

export default MemoryGame;
