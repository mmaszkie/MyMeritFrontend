export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-bg-color": "#2c2d37",
        "blue-450": "#4E94F8",
        "emerald-450": "#22C68D",
        "secondary-bg-color": "#3a3b46",
        "main-lighter": "#737485",
        "main-lighter-2": "#555764",
        "main-darker": "#21222c",
        "main-font-color": "#fff",
        "main-border": "#6a6c76",
        "task-bck": "#434550",
        "task-lighter": "#8c8f9f",
        "merit-credits-color": "#ffcc00",
        "terminal-color": "#3a3b46",
        "ide-color": "#34353f",
        "terminal-border": "#555764",
        "job-primary": "#22C68D",
      },
      screens: {
        xlg: "1440px",
      },
      animation: {
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97)",
      },
      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },
    },
  },
  plugins: [],
};
