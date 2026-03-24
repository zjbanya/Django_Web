import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",          // 扫描 HTML
    "./src/**/*.{js,ts,jsx,tsx}", // 扫描 src 下所有 JS/TS/JSX/TSX 文件
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8', // 自定义主题色
        secondary: '#9333ea',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // 可选插件：漂亮的表单样式
    require('@tailwindcss/typography'), // 可选插件：排版
  ],
}