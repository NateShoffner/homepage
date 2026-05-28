import type { IconType } from 'react-icons'
import {
  SiJavascript, SiTypescript, SiPython, SiRust, SiGo,
  SiCplusplus, SiC, SiDotnet, SiRuby, SiPhp,
  SiSwift, SiKotlin, SiDart, SiHtml5, SiCss3,
  SiLua, SiHaskell, SiScala, SiR,
  SiSass, SiVuedotjs, SiElixir, SiGnubash, SiElm,
  SiNim, SiZig, SiOcaml, SiPerl, SiCoffeescript,
} from 'react-icons/si'
import { DiJava } from 'react-icons/di'

const LANG_ICONS: Record<string, IconType> = {
  'JavaScript':   SiJavascript,
  'TypeScript':   SiTypescript,
  'Python':       SiPython,
  'Rust':         SiRust,
  'Go':           SiGo,
  'C++':          SiCplusplus,
  'C':            SiC,
  'C#':           SiDotnet,
  'Java':         DiJava,
  'Ruby':         SiRuby,
  'PHP':          SiPhp,
  'Swift':        SiSwift,
  'Kotlin':       SiKotlin,
  'Dart':         SiDart,
  'HTML':         SiHtml5,
  'CSS':          SiCss3,
  'SCSS':         SiSass,
  'Shell':        SiGnubash,
  'Lua':          SiLua,
  'Haskell':      SiHaskell,
  'Scala':        SiScala,
  'R':            SiR,
  'Vue':          SiVuedotjs,
  'Elixir':       SiElixir,
  'Elm':          SiElm,
  'Nim':          SiNim,
  'Zig':          SiZig,
  'OCaml':        SiOcaml,
  'Perl':         SiPerl,
  'CoffeeScript': SiCoffeescript,
}

interface LanguageIconProps {
  language: string
  className?: string
}

export function LanguageIcon({ language, className }: LanguageIconProps) {
  const Icon = LANG_ICONS[language]
  if (!Icon) return null
  return <Icon className={className ?? 'gw-lang-icon'} aria-hidden="true" />
}
