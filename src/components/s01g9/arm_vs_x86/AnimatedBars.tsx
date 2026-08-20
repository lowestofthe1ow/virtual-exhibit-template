import { motion } from "framer-motion";

function AnimatedBars({
  data,
}: {
  data: { metric: string; arm: number; x86: number }[];
}) {
  // Returns a percentage width relative to the larger value in the row
  const getWidth = (value: number, max: number) =>
    `${(value / max) * 100}%`;

  return (
    <div className="space-y-5">
      {data.map((item) => {
        const rowMax = Math.max(item.arm, item.x86);

        return (
          <div key={item.metric}>
            <p className="text-xs text-gray-400 font-medium mb-2 tracking-wide">
              {item.metric}
            </p>

            <div className="space-y-1.5">
              {/* ARM */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-s01g9-mono font-medium text-s01g9-arm/80 w-9 shrink-0">
                  ARM
                </span>

                <div className="flex-1 bg-[#2A2F3B] rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: "#00C2D1",
                      boxShadow: "0 0 8px rgba(0,194,209,0.2)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: getWidth(item.arm, rowMax) }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                <span className="text-xs font-s01g9-mono text-gray-400 w-14 text-right tabular-nums">
                  {item.arm}
                </span>
              </div>

              {/* x86 */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-s01g9-mono font-medium text-s01g9-x86/80 w-9 shrink-0">
                  x86
                </span>

                <div className="flex-1 bg-[#2A2F3B] rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: "#FF8C42",
                      boxShadow: "0 0 8px rgba(255,140,66,0.2)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: getWidth(item.x86, rowMax) }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.2,
                    }}
                  />
                </div>

                <span className="text-xs font-s01g9-mono text-gray-400 w-14 text-right tabular-nums">
                  {item.x86}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AnimatedBars;