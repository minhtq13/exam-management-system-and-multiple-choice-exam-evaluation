import { Column } from "@ant-design/plots";
import React from "react";
import "./ChartColumn.scss";

const ChartColumn = ({dataColumnChart, resultData}) => {
  const data = dataColumnChart;

  const config = {
    data,
    xField: "name",
    yField: "value",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    style: {
      maxWidth: 25,
      fill: ({ name }) => {
        if (Number(name) <= 3) {
          return "#d74858";
        } else if (Number(name) > 3 && Number(name) <= 5) return "#fc9362";
         else if (Number(name) > 5 && Number(name) <= 7) return "#fee291";
         else if (Number(name) > 7 && Number(name) <= 8) return "#e7f69d";
         else if (Number(name) > 8 && Number(name) <= 9) return "#9ed79a";
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
