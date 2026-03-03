/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#833cf6",
                "accent-blue": "#00d4ff",
                "background-light": "#f7f5f8",
                "background-dark": "#030305",
                "obsidian-light": "#12121a",
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "sans-serif"]
            },
        },
    },
    plugins: [],
}
