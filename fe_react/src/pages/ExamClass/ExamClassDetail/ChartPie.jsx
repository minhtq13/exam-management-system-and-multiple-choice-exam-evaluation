import React from "react";
import "./ChartPie.scss";
import { Pie } from '@ant-design/plots';

const ChartPie = () => {

  const data = [
    {
      name: "0-3",
      value: 7,
    },
    {
      name: "3-5",
      value: 10,
    },
    {
      name: "5-7",
      value: 27,
    },
    {
      name: "7-8",
      value: 20,
    },
    {
      name: "8-9",
      value: 15,
    },
    {
      name: "9-10",
      value: 2,
    },
  ]
  const config = {
    data,
    angleField: 'value',
    colorField: 'name',
    innerRadius: 0.6,
    labels: [
      { text: 'name', style: { fontSize: 12, fontWeight: 'bold' } },
      {
        text: (d, i, data) => {
          return `${((d.value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(2)}%`;
        },
        style: {
          fontSize: 10,
          dy: 12,
        },
      },
    ],
    style: {
      stroke: '#fff',
      inset: 1,
      radius: 10,
    },
    scale: {
      color: {
        palette: 'spectral',
        offset: (t) => t * 0.8 + 0.1,
      },
    },
    legend: {
      color: {
        title: 'Điểm',
        position: 'bottom',
        layout: {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        },
      },
    },
    interaction: {
      tooltip: {
        render: (e, { title, items }) => {
          return (
            <div key={title} style={{minWidth: 150}}>
              <h4>{title}</h4>
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
                        <span>Số lượng: </span>
                      </div>
                      <b>{value}</b>
                    </div>
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
                        <span>Phần trăm: </span>
                      </div>
                      <b>
                        {((value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(2)}%
                      </b>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    },
  };
  return (
    <div className="chart-pie-component">
      <Pie {...config} />
    </div>
  );
};

export default ChartPie;
