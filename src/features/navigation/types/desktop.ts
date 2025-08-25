export interface SidebarSectionItem {
  label: string
  icon?: React.ReactNode
}

export interface SidebarSectionData {
  title: string
  items: SidebarSectionItem[]
}

export interface SidebarSectionProps {
  sections?: SidebarSectionData[]
}
// Types pour DesktopSidebar
export interface DesktopSidebarProps {
  className?: string
  isExpanded?: boolean
  sections?: string[]
  open?: boolean
}

export type DesktopSidebarSection = 'header' | 'nav' | 'footer'

export interface Theme {
  transitions: {
    create: (
      prop: string,
      options: { easing: string; duration: number }
    ) => string
    easing: { sharp: string }
    duration: { enteringScreen: number; leavingScreen: number }
  }
  spacing: (factor: number) => number | string
  breakpoints: { up: (key: string) => string }
}
