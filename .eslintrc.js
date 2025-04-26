module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: false
  },
  rules: {
    'vue/multi-word-component-names': 'off', // 🔥 關掉元件名稱強制多字
    'vue/no-reserved-component-names': 'warn', // ⚠️ 改成 warning 提醒，不強制報錯
    'vue/no-mutating-props': 'error', // ✅ 保持強制，props禁止直接改動
    'no-var': 'warn' // ⚠️ var 改成 warning，不強制爆錯
  }
}
