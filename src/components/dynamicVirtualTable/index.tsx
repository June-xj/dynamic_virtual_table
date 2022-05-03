import React, { useEffect, useRef, useState } from "react";
import useVirtual from "./useVirtual";
import datas from "./mockdata";

import "./index.css";

const colors = ["#8868ff", "#24cdd0"];
const rowAnimate = "wrapper__animation";

let timer: any = null;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [data, setData] = useState(JSON.stringify(datas));
  const dataObject = JSON.parse(data);
  const [classes, setClasses] = useState(rowAnimate); // 行滚动
  const [pause, setPause] = useState(false);
  const [temp, setTemp] = useState(0);
  const ref = useRef();
  const [list1, containerProps1, wrapperProps1, reCalculate]: any = useVirtual({
    total: dataObject.length,
    height: 280,
    itemHeight: 54,
  });
  const {
    ref: { current },
  } = containerProps1;

  const updateRowData = () => {
    const newData = dataObject;
    newData.push(newData[0]);
    newData.shift();
    setData(() => JSON.stringify(newData));
  };

  useEffect(() => {
    reCalculate(temp);
    setTemp(0);
  }, [data]);

  return (
    <div>
      <div
        ref={ref}
        {...containerProps1}
        onMouseEnter={() => {
          setPause(() => true);
        }}
        onMouseLeave={() => {
          setPause(() => false);
        }}
        onScroll={(e) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            const { scrollTop, scrollHeight } = current;
            console.log("scroll", scrollTop, scrollHeight);
            if (scrollTop >= scrollHeight - 280 - 54) {
              console.log("xxxx");
              setTemp(-1);
              updateRowData();
              setClasses("");
              setPause(true);
              setTimeout(() => {
                setClasses(rowAnimate);
              }, 3000);
            }
            containerProps1.onScroll(e);
          }, 20);
        }}
      >
        <div
          className={`wrapper ${classes}`}
          onAnimationEndCapture={(e) => {
            setClasses("");
            updateRowData(); // row
          }}
          onAnimationEnd={() => {
            setTimeout(() => {
              setClasses(rowAnimate);
            });
          }}
          onAnimationIteration={(e) => {
            updateRowData(); // row
          }}
          style={{
            ...wrapperProps1.style,
            animationName: `${classes ? "rollUp" : "none"}`,
            animationDuration: "2s",
            animationDelay: "3s",
            animationPlayState: pause ? "paused" : "running",
          }}
        >
          {list1.map(({ style, index }: any) => {
            return (
              <div
                style={{
                  ...style,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background:
                    colors[parseInt(dataObject[index][0].key) % colors.length],
                  borderBottom: "1px solid #e8e8e8",
                }}
                key={index}
              >
                {dataObject[index][0].value + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
