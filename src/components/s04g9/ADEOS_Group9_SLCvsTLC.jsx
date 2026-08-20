import background from "../../assets/s04g9/ADEOS_Group9_SLCvsTLCBackground.svg";
import slcCell from "../../assets/s04g9/ADEOS_Group9_SLCCell.svg";
import tlcCell from "../../assets/s04g9/ADEOS_Group9_TLCCell.svg";
import slcBorder from "../../assets/s04g9/ADEOS_Group9_SLCBorder.svg";
import tlcBorder from "../../assets/s04g9/ADEOS_Group9_TLCBorder.svg";
import tlcArrow from "../../assets/s04g9/ADEOS_Group9_TLCArrow.svg";

function assetSrc(asset) {
  return asset.src ?? asset;
}

export default function SLCvsTLC() {
  const slcCellOffsets = [-2.2, 2.2];
  const tlcCellOffsets = [-8.4, -6, -3.6, -1.2, 1.2, 3.6, 6, 8.4];

  return (
    <>
      <section className="adeos-g9-component adeos-g9-slc-tlc" aria-labelledby="adeos-g9-slc-tlc-title">
        <img
          className="adeos-g9-slc-tlc__layer adeos-g9-slc-tlc__background"
          src={assetSrc(background)}
          alt=""
        />

        <img
          className="adeos-g9-slc-tlc__layer adeos-g9-slc-tlc__border adeos-g9-slc-tlc__border--slc"
          src={assetSrc(slcBorder)}
          alt=""
        />
        <img
          className="adeos-g9-slc-tlc__layer adeos-g9-slc-tlc__border adeos-g9-slc-tlc__border--tlc"
          src={assetSrc(tlcBorder)}
          alt=""
        />

        {slcCellOffsets.map((offset, index) => (
          <img
            key={`slc-cell-${index}`}
            className="adeos-g9-slc-tlc__layer adeos-g9-slc-tlc__cell adeos-g9-slc-tlc__cell--slc"
            src={assetSrc(slcCell)}
            alt=""
            style={{ "--offset": `${offset}%` }}
          />
        ))}

        {tlcCellOffsets.map((offset, index) => (
          <img
            key={`tlc-cell-${index}`}
            className="adeos-g9-slc-tlc__layer adeos-g9-slc-tlc__cell adeos-g9-slc-tlc__cell--tlc"
            src={assetSrc(tlcCell)}
            alt=""
            style={{ "--offset": `${offset}%` }}
          />
        ))}

        <img
          className="adeos-g9-slc-tlc__layer adeos-g9-slc-tlc__arrow-layer"
          src={assetSrc(tlcArrow)}
          alt=""
        />

        <h2 id="adeos-g9-slc-tlc-title" className="adeos-g9-slc-tlc__title">
          SLC vs TLC
        </h2>

        <h3 className="adeos-g9-slc-tlc__heading adeos-g9-slc-tlc__heading--slc">
          Single-Level Cell
        </h3>

        <h3 className="adeos-g9-slc-tlc__heading adeos-g9-slc-tlc__heading--tlc">
          Triple-Level Cell
        </h3>

        <div className="adeos-g9-slc-tlc__binary adeos-g9-slc-tlc__binary--slc">
          <span>1</span>
          <span>0</span>
        </div>

        <div className="adeos-g9-slc-tlc__binary adeos-g9-slc-tlc__binary--tlc">
          <span>111</span>
          <span>000</span>
        </div>

        <div className="adeos-g9-slc-tlc__details adeos-g9-slc-tlc__details--slc">
          <strong>States: 2</strong>
          <p>
            1 bit per cell<br />
            Fast read / write<br />
            High endurance<br />
            Lower capacity<br />
            Higher cost
          </p>
        </div>

        <div className="adeos-g9-slc-tlc__details adeos-g9-slc-tlc__details--tlc">
          <strong>States: 8</strong>
          <p>
            3 bits per cell<br />
            Slower read / write<br />
            Lower endurance<br />
            Higher capacity<br />
            Lower cost per GB
          </p>
        </div>
      </section>

      <style>{`
        .adeos-g9-slc-tlc {
          position: relative;
          border: 1px solid #8a4dff;
          box-shadow:
            0 0 24px rgba(138, 77, 255, 0.35),
            inset 0 0 38px rgba(101, 251, 255, 0.08);
        }

        .adeos-g9-slc-tlc__layer {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .adeos-g9-slc-tlc__background {
          z-index: 1;
        }

        .adeos-g9-slc-tlc__border {
          z-index: 2;
        }

        .adeos-g9-slc-tlc__cell {
          z-index: 3;
        }

        .adeos-g9-slc-tlc__arrow-layer {
          z-index: 4;
          transform: translateY(-0.3%);
        }

        .adeos-g9-slc-tlc__border--slc {
          transform: translateY(10%);
        }

        .adeos-g9-slc-tlc__border--tlc {
          transform: translateY(0);
        }

        .adeos-g9-slc-tlc__title,
        .adeos-g9-slc-tlc__heading,
        .adeos-g9-slc-tlc__binary,
        .adeos-g9-slc-tlc__details {
          position: absolute;
          z-index: 5;
          color: #ffffff;
          font-family: "Space Mono", "Noto Sans Variable", monospace;
          font-size: 46px;
        }

        .adeos-g9-slc-tlc__title {
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          font-family: "Space Mono", monospace;
          font-size: 46px;
          text-align: center;
          text-shadow:
            0 0 6px rgba(255, 255, 255, 0.95),
            0 0 18px rgba(101, 251, 255, 0.45);
        }

        .adeos-g9-slc-tlc__heading,
        .adeos-g9-slc-tlc__binary,
        .adeos-g9-slc-tlc__details,
        .adeos-g9-slc-tlc__details p,

        .adeos-g9-slc-tlc__heading {
          margin: 0;
          font-size: 1.55rem;
          letter-spacing: 0.03em;
          text-align: center;
        }

        .adeos-g9-slc-tlc__heading--slc {
          top: 15%;
          left: -7%;
          width: 50%;
        }

        .adeos-g9-slc-tlc__heading--tlc {
          top: 15%;
          right: -7%;
          width: 50%;
        }

        .adeos-g9-slc-tlc__binary {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4.8rem;
          font-size: 1.65rem;
          line-height: 1;
          text-align: center;
        }

        .adeos-g9-slc-tlc__binary--slc {
          top: 43%;
          left: 35%;
          gap: 0.85rem;
        }

        .adeos-g9-slc-tlc__binary--tlc {
          top: 33%;
          right: 16%;
          gap: 5.5rem;
        }

        .adeos-g9-slc-tlc__details {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .adeos-g9-slc-tlc__details p {
          margin: 0;
          color: #ffffff;
          font-family: "Space Mono", monospace;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.18;
          text-align: center;
        }

        .adeos-g9-slc-tlc__details--slc {
          left: 9%;
          bottom: 14%;
          width: 38%;
        }

        .adeos-g9-slc-tlc__details--tlc {
          right: 9%;
          bottom: 14%;
          width: 39%;
        }

        @media (max-width: 760px) {
          .adeos-g9-slc-tlc {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: 0.75rem;
            min-height: 0;
            padding: 1.25rem 0.85rem;
            aspect-ratio: auto !important;
          }

          .adeos-g9-slc-tlc__border,
          .adeos-g9-slc-tlc__cell,
          .adeos-g9-slc-tlc__arrow-layer,
          .adeos-g9-slc-tlc__binary {
            display: none;
          }

          .adeos-g9-slc-tlc__title {
            position: relative;
            grid-row: 1;
            top: auto;
            left: auto;
            margin: 0 0 0.35rem;
            transform: none;
            font-size: 1.7rem;
          }

          .adeos-g9-slc-tlc__heading {
            position: relative;
            top: auto;
            right: auto;
            left: auto;
            width: auto;
            padding-bottom: 0.4rem;
            border-bottom: 1px solid rgba(101, 251, 255, 0.55);
            font-size: 1rem;
            text-align: left;
          }

          .adeos-g9-slc-tlc__heading--slc {
            grid-row: 2;
          }

          .adeos-g9-slc-tlc__heading--tlc {
            grid-row: 4;
            margin-top: 0.35rem;
          }

          .adeos-g9-slc-tlc__details {
            position: relative;
            right: auto;
            bottom: auto;
            left: auto;
            width: auto;
            align-items: flex-start;
            padding: 0.85rem;
            border: 1px solid rgba(101, 251, 255, 0.25);
            background: rgba(5, 10, 28, 0.72);
            font-size: 1rem;
            text-align: left;
          }

          .adeos-g9-slc-tlc__details--slc {
            grid-row: 3;
          }

          .adeos-g9-slc-tlc__details--tlc {
            grid-row: 5;
          }

          .adeos-g9-slc-tlc__details p {
            margin-top: 0.35rem;
            font-size: 0.82rem;
            line-height: 1.45;
            text-align: left;
          }
        }
      `}</style>
    </>
  );
}