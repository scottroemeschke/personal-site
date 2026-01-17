/**
 * App definitions registry.
 *
 * Central registry of all available apps with their metadata.
 */

import type { AppDefinition } from '@/types/desktop'
import type { LucideIcon } from 'lucide-react'
import { FolderCode, Link, Mail, User } from 'lucide-react'
import type { ComponentType } from 'react'

// Lazy imports for app components
import { AboutApp } from './AboutApp'
import { DeaddropApp } from './DeaddropApp'
import { ProjectsApp } from './ProjectsApp'
import { TasteApp } from './TasteApp'

/**
 * All available app definitions.
 */
export const APP_DEFINITIONS: AppDefinition[] = [
  {
    id: 'about',
    title: 'ABOUT.exe',
    icon: 'User',
    defaultSize: { width: 500, height: 400 },
    minSize: { width: 400, height: 300 },
    resizable: false,
  },
  {
    id: 'taste',
    title: 'TASTE.links',
    icon: 'Link',
    defaultSize: { width: 450, height: 500 },
    minSize: { width: 350, height: 400 },
    resizable: false,
  },
  {
    id: 'projects',
    title: 'PROJECTS.log',
    icon: 'FolderCode',
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 500, height: 400 },
    resizable: false,
  },
  {
    id: 'deaddrop',
    title: 'DEADDROP.msg',
    icon: 'Mail',
    defaultSize: { width: 450, height: 400 },
    minSize: { width: 400, height: 350 },
    resizable: false,
  },
]

/**
 * Map of app ID to component.
 */
const APP_COMPONENTS: Record<string, ComponentType> = {
  about: AboutApp,
  taste: TasteApp,
  projects: ProjectsApp,
  deaddrop: DeaddropApp,
}

/**
 * Map of app ID to Lucide icon.
 */
const APP_ICONS: Record<string, LucideIcon> = {
  about: User,
  taste: Link,
  projects: FolderCode,
  deaddrop: Mail,
}

/**
 * Get app definition by ID.
 */
export function getAppDefinition(appId: string): AppDefinition | undefined {
  return APP_DEFINITIONS.find((app) => app.id === appId)
}

/**
 * Get app component by ID.
 */
export function getAppComponent(appId: string): ComponentType | undefined {
  return APP_COMPONENTS[appId]
}

/**
 * Get app icon by ID.
 */
export function getAppIcon(appId: string): LucideIcon | undefined {
  return APP_ICONS[appId]
}
