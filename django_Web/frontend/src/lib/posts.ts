export type BlogPost = {
  slug: string
  date: string // ISO or display string; later you can format
  title: string
  summary: string
  contentMarkdown: string
}

// 先用静态数据占位（你后面可以替换为本地 .mdx 或后端接口）。
export const posts: BlogPost[] = [
  {
    slug: 'welcome',
    date: '2026-03-26',
    title: '欢迎来到桌面壳博客',
    summary: '这是一个拟真 Linux 风格的博客入口原型。后续你可以把内容替换成 MDX。',
    contentMarkdown:
      '# 欢迎来到桌面壳博客\n\n这是一篇示例文章，用于验证前端与桌面 UI 的联动。',
  },
]

