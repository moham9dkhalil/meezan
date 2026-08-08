import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface MasteryPieChartProps {
  mastered: number;
  remaining: number;
  total: number;
  categoryName: string;
}

export function MasteryPieChart({ mastered, remaining, total, categoryName }: MasteryPieChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 110;
    const height = 110;
    const radius = Math.min(width, height) / 2 - 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Data for pie
    const isZeroMastered = mastered === 0;
    const data = [
      { label: "متقنة", value: mastered, color: "#10B981" }, // emerald-500
      { label: "متبقية", value: isZeroMastered ? total : remaining, color: "#312E81" } // indigo-900
    ];

    const pie = d3
      .pie<{ label: string; value: number; color: string }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
      .innerRadius(radius * 0.65)
      .outerRadius(radius)
      .cornerRadius(4)
      .padAngle(0.04);

    const arcs = pie(data);

    g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => (isZeroMastered && d.data.label === "متقنة" ? "transparent" : d.data.color))
      .attr("stroke", "#0f0c29")
      .attr("stroke-width", 2);

  }, [mastered, remaining, total]);

  const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4">
      <div className="relative w-[110px] h-[110px] flex items-center justify-center shrink-0">
        <svg ref={svgRef} className="w-[110px] h-[110px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-base font-black text-white">{percentage}%</span>
          <span className="text-[10px] text-gray-400 font-bold">إتقان</span>
        </div>
      </div>

      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-200 font-black truncate">
            📊 نسبة الإتقان ({categoryName})
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              بطاقات متقنة:
            </span>
            <span className="font-black text-white">{mastered}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-900 inline-block" />
              بطاقات متبقية:
            </span>
            <span className="font-black text-white">{remaining}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-gray-400">
            <span>إجمالي التصنيف:</span>
            <span className="font-bold text-gray-200">{total} بطاقة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
