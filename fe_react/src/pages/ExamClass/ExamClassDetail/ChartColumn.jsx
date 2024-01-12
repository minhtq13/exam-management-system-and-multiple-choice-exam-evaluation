import { Column } from "@ant-design/plots";
import React from "react";
import "./ChartColumn.scss";

const ChartColumn = () => {
  const data = [
    {
      mark: "1",
      number: 38,
    },
    {
      mark: "1.5",
      number: 58,
    },
    {
      mark: "2",
      number: 52,
    },
    {
      mark: "2.5",
      number: 55,
    },
    {
      mark: "3",
      number: 61,
    },
    {
      mark: "3.5",
      number: 70,
    },
    {
      mark: "4",
      number: 145,
    },
    {
      mark: "4.5",
      number: 15,
    },
    {
      mark: "5",
      number: 48,
    },
    {
      mark: "5.5",
      number: 30,
    },
    {
      mark: "6",
      number: 20,
    },
    {
      mark: "6.5",
      number: 38,
    },
    {
      mark: "7",
      number: 60,
    },
    {
      mark: "7.5",
      number: 50,
    },
    {
      mark: "8",
      number: 38,
    },
    {
      mark: "8.5",
      number: 45,
    },
    {
      mark: "9",
      number: 20,
    },
    {
      mark: "9.5",
      number: 38,
    },
    {
      mark: "10",
      number: 40,
    },
  ];
  const config = {
    data,
    xField: "mark",
    yField: "number",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    style: {
      maxWidth: 25,
      fill: ({ mark }) => {
        if (Number(mark) <= 3) {
          return "#d74858";
        } else if (Number(mark) > 3 && Number(mark) <= 5) return "#fc9362";
         else if (Number(mark) > 5 && Number(mark) <= 7) return "#fee291";
         else if (Number(mark) > 7 && Number(mark) <= 8) return "#e7f69d";
         else if (Number(mark) > 8 && Number(mark) <= 9) return "#9ed79a";
        return '#3c8ec1';
      },
    },
    interaction: {
      tooltip: {
        render: (e, { title, items }) => {
          return (
            <div key={title}>
              <h4>Điểm {title}</h4>
              {items.map((item, index) => {
                const { value, color } = item;
                return (
                  <div key={index}>
                    <div style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: color,
                            marginRight: 6,
                          }}
                        ></span>
                        <span>Số lượng</span>
                      </div>
                      <b>{value}</b>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return (
    <div className="chart-column-component">
      <Column {...config} />
    </div>
  );
};

export default ChartColumn;
