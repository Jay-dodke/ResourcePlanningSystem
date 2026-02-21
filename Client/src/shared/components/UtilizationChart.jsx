import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const UtilizationChart = ({data}) => {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Utilization</p>
          <h3 className="text-lg font-semibold">Weekly load</h3>
        </div>
        <span className="text-xs text-secondary">Last 8 weeks</span>
      </div>
      <div className="mt-4 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="util" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--accent))" stopOpacity={0.6} />
                <stop offset="95%" stopColor="rgb(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgb(var(--chart-grid))" strokeDasharray="4 4" />
            <XAxis dataKey="label" stroke="rgb(var(--chart-axis))" fontSize={12} />
            <YAxis stroke="rgb(var(--chart-axis))" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "rgb(var(--chart-tooltip-bg))",
                border: "1px solid rgb(var(--chart-tooltip-border))",
                borderRadius: 12,
                color: "rgb(var(--text-primary))",
              }}
              itemStyle={{color: "rgb(var(--text-primary))"}}
              labelStyle={{color: "rgb(var(--text-secondary))"}}
            />
            <Area type="monotone" dataKey="value" stroke="rgb(var(--accent))" fill="url(#util)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UtilizationChart;






