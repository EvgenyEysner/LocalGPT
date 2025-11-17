/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'gpt-dark': '#0d0d0d',
                'gpt-gray': '#1a1a1a',
                'gpt-light-gray': '#f7f7f8',
                'gpt-border': '#d1d5db',
                'gpt-user': '#10a37f',
                'gpt-assistant': '#343541',
            }
        },
    },
    plugins: [],
}

