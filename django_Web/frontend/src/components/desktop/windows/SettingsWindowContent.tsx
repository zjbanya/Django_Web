import SystemSettingsDrawer from '../toolbars/SystemSettingsDrawer'

/**
 * Settings app content：
 * 直接复用右侧“系统栏”的内容组件，让它运行在可拖拽的窗口框内。
 */
export default function SettingsWindowContent() {
  return <SystemSettingsDrawer />
}

