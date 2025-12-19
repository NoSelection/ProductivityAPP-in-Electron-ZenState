/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#1a1b26",
                surface: "#24283b",
                primary: "#7aa2f7",
                secondary: "#bb9af7",
                text: "#c0caf5",
            },
            borderRadius: {
                lg: "12px",
                md: "8px",
                sm: "4px",
            }
        },
    },
    plugins: [],
}
