import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import styles from "../../styles/DayEmotionChart.module.css";

export interface DayEmotionPoint {
  day: string;
  score: number; // 1 ~ 5
  emoji?: string;
  label?: string;
  date?: string;
}

interface DayEmotionChartProps {
  data: DayEmotionPoint[];
  title?: string;
  subtitle?: string;
  insight?: string;
}

const emotionLevelMap: Record<number, string> = {
  1: "나쁨",
  2: "조금 다운",
  3: "보통",
  4: "좋음",
  5: "매우 좋음",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DayEmotionPoint }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDay}>{item.date ?? label}</p>
      <p className={styles.tooltipEmoji}>{item.emoji ?? "🙂"}</p>
      <p className={styles.tooltipText}>
        {item.label ?? emotionLevelMap[Math.round(item.score)] ?? "보통"}
      </p>
      <p className={styles.tooltipScore}>감정 점수 {item.score.toFixed(1)}</p>
    </div>
  );
};

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: DayEmotionPoint;
}

const CustomDot = ({ cx, cy, payload }: CustomDotProps) => {
  if (cx == null || cy == null) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={8} className={styles.dotOuter} />
      <circle cx={cx} cy={cy} r={4.5} className={styles.dotInner} />
      {payload?.emoji && (
        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          className={styles.dotEmoji}
        >
          {payload.emoji}
        </text>
      )}
    </g>
  );
};

const DayEmotionChart = ({
  data,
  title = "주간 감정 그래프",
  subtitle = "지난 7일 간의 감정 변화를 확인해보세요.",
  insight = "최근 감정 흐름을 바탕으로 AI가 분석한 결과예요.",
}: DayEmotionChartProps) => {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 28, right: 20, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="emotionFillPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff8fab" stopOpacity={0.32} />
                <stop offset="55%" stopColor="#ffc2d1" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#fff5f8" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              className={styles.grid}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              className={styles.axisText}
            />

            <YAxis
              domain={[1, 5]}
              ticks={[1, 3, 5]}
              tickFormatter={(value) => {
                if (value === 1) return "나쁨";
                if (value === 3) return "보통";
                if (value === 5) return "좋음";
                return "";
              }}
              tickLine={false}
              axisLine={false}
              width={52}
              className={styles.axisText}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#f7b6c8", strokeWidth: 1.5 }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#ff6f91"
              strokeWidth={3.5}
              fill="url(#emotionFillPink)"
              dot={<CustomDot />}
              activeDot={{
                r: 6,
                fill: "#ff6f91",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.insightBox}>
        <span className={styles.insightEmoji}>💗</span>
        <p className={styles.insightText}>{insight}</p>
      </div>
    </section>
  );
};

export default DayEmotionChart;