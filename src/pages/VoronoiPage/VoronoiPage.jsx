// VoronoiPage.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
const VoronoiPage = () => {const svgRef = useRef(null);

  useEffect(() => {
    const imgUrl = '/static/img/F8jNHdwaYAAjidI.jpg'; // 로컬 이미지 경로
    const width = 1920;
    const height = 1080;
    const numPoints = Math.round(width * height / 40);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const context = document.createElement('canvas').getContext('2d');
    const image = new Image();
    image.src = imgUrl;

    image.onload = () => {
      context.drawImage(image, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height).data;
      const data = new Float64Array(width * height);

      // Convert image pixel data to usable data for Voronoi
      for (let i = 0, n = imageData.length / 4; i < n; i++) {
        data[i] = Math.max(0, 1 - imageData[i * 4] / 254);
      }

      // Worker 생성
      const workerBlob = new Blob([`
        importScripts("${'https://d3js.org/d3-delaunay.v6.min.js'}");

        onmessage = event => {
          const { data, width, height, n } = event.data;
          const points = new Float64Array(n * 2);
          const c = new Float64Array(n * 2);
          const s = new Float64Array(n);

          // Initialize the points using rejection sampling.
          for (let i = 0; i < n; ++i) {
            for (let j = 0; j < 30; ++j) {
              const x = points[i * 2] = Math.floor(Math.random() * width);
              const y = points[i * 2 + 1] = Math.floor(Math.random() * height);
              if (Math.random() < data[y * width + x]) break;
            }
          }

          const delaunay = d3.Delaunay.from(points);
          const voronoi = delaunay.voronoi([0, 0, width, height]);

          for (let k = 0; k < 80; ++k) {
            c.fill(0);
            s.fill(0);
            for (let y = 0; y < height; ++y) {
              for (let x = 0; x < width; ++x) {
                const w = data[y * width + x];
                const i = delaunay.find(x, y);
                s[i] += w;
                c[i * 2] += w * x;
                c[i * 2 + 1] += w * y;
              }
            }

            for (let i = 0; i < n; ++i) {
              const x0 = points[i * 2], y0 = points[i * 2 + 1];
              const x1 = s[i] ? c[i * 2] / s[i] : x0;
              const y1 = s[i] ? c[i * 2 + 1] / s[i] : y0;
              points[i * 2] = x0 + (x1 - x0) * 0.1;
              points[i * 2 + 1] = y0 + (y1 - y0) * 0.1;
            }

            postMessage(points);
          }

          close();
        };
      `], { type: "application/javascript" });

      const worker = new Worker(URL.createObjectURL(workerBlob));
      worker.postMessage({ data, width, height, n: numPoints });

      worker.onmessage = ({ data: points }) => {
        // Clear previous drawing
        svg.selectAll('*').remove();

        const delaunay = d3.Delaunay.from(points);
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        svg.selectAll('path')
          .data(voronoi.cellPolygons())
          .enter()
          .append('path')
          .attr('d', d => `M${d.join('L')}Z`)
          .style('fill', (d) => {
            const x = Math.floor(d[0][0]);
            const y = Math.floor(d[0][1]);
            const idx = (y * width + x) * 4;
            const r = imageData[idx];
            const g = imageData[idx + 1];
            const b = imageData[idx + 2];
            return `rgb(${r}, ${g}, ${b})`;
          })
          .style('stroke', '#000')
          .style('stroke-width', 0.5);
      };
    };
  }, []);

  return <svg ref={svgRef}></svg>;
};
export default VoronoiPage;
