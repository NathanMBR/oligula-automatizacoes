import {
  type Icon,
  IconAutomation,
  IconRubberStamp,
  IconTable
} from '@tabler/icons-react'

type NavbarItem = {
  link: string
  label: string
  icon: Icon
}

export const navbarItems = [
  {
    link: '/automator/-1',
    label: 'Automatizador',
    icon: IconAutomation
  }

  // {
  //   link: '/inmetro-seal-generator',
  //   label: 'Gerador de selo Inmetro',
  //   icon: IconRubberStamp
  // },

  // {
  //   link: '/spreadsheet-formatter',
  //   label: 'Formatador de planilhas',
  //   icon: IconTable
  // }
] as const satisfies Array<NavbarItem> // merging 'as const' with 'satisfies' to get both type enforcement and inference

export type NavbarItemsLabels = typeof navbarItems[number]['label']
