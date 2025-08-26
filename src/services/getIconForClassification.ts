import { normalizeKey } from '@/shared/utils/formatStrings'
import {
  AlertTriangle,
  Banknote,
  Briefcase,
  BriefcaseBusiness,
  Building,
  FileCheck,
  FileText,
  Gavel,
  Grid,
  Handshake,
  Heart,
  Home,
  MoreHorizontal,
  PiggyBank,
  Shield,
  Stethoscope,
  UserMinus,
  UserPlus,
  UserSearch,
  Users,
} from 'lucide-react'
import { ComponentType } from 'react'

// Mapping des classifications vers les icônes appropriées
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  // Données partenaires (avec et sans accents)
  santé: Stethoscope,
  sante: Stethoscope,
  spécialiste: UserPlus,
  specialiste: UserPlus,
  juridique: Gavel,
  affaires: BriefcaseBusiness,
  finance: Banknote,
  comptabilité: FileText,
  comptabilite: FileText,
  immobilier: Home,
  exécution: FileCheck,
  execution: FileCheck,
  banque: PiggyBank,
  assurance: Shield,
  risque: AlertTriangle,
  rh: Users,
  recrutement: UserSearch,
  affacturage: Handshake,
  // fallback et anciens mappings
  legal: Shield,
  business: Briefcase,
  specialist: UserPlus,
  healthcare: Heart,
  insurance: Shield,
  hr: Users,
  'real-estate': Building,
  amoureux: Heart,
  famille: Users,
  ami: UserPlus,
  collègue: Briefcase,
  collegue: Briefcase,
  connaissance: Users,
  ex: UserMinus,
  autre: MoreHorizontal,
}

// Correction : accepte string ou objet {icon, name}, fallback sur Grid
export function getIconForClassification(
  classification: { icon?: string; name: string } | string
): ComponentType<{ className?: string }> {
  let key = ''
  if (typeof classification === 'string') {
    key = normalizeKey(classification)
  } else {
    key = normalizeKey(classification.icon || classification.name)
  }
  return iconMap[key] || Grid
}
