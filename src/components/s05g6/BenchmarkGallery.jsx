export default function BenchmarkGallery({ benchmarks = [] }) {

  if (!benchmarks.length) {
    return <div>No benchmarks</div>;
  }

  const maxBenchmark = Math.max(
    ...benchmarks.map((b) => b.benchmark)
  );

  return (
    <div className="benchmark-gallery">

      {benchmarks.map((item) => {
        const percentage = (item.benchmark / maxBenchmark) * 100;

        return (
          <div className="benchmark-item" key={item.name}>

            <div className="info">
              <h3>{item.name}</h3>
              <p>
                {item.metric}: {item.value}
              </p>
            </div>

            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${percentage}%`
                }}
              >
                {percentage.toFixed(1)}%
              </div>
            </div>

          </div>
        );
      })}

      <style>{`
        .benchmark-gallery {
          width: 100%;
          margin: 20px 0;
        }

        .benchmark-item {
          margin-bottom: 25px;
        }

        .info h3 {
          margin: 0;
        }

        .bar-container {
          width: 100%;
          height: 30px;
          background: #ddd;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: green;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
      `}</style>

    </div>
  );
}