import DesktopShell from '../components/desktop/DesktopShell'
import { DesktopProvider } from '../state/DesktopContext'
import { WindowStoreProvider } from '../windowing/windowStore'

/**
 * 桌面系统风格博客首页：
 * - 壁纸全屏背景：中间区域不遮挡
 * - 四个工具栏默认收起，仅露边界；悬停后滑出
 * - 角落窗口展示博客列表/详情入口（原型）
 */
function HomePage() {
  return (
    <DesktopProvider>
      <WindowStoreProvider>
        <DesktopShell />
      </WindowStoreProvider>
    </DesktopProvider>
  )
}

export default HomePage
