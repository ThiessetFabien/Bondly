import {
  Briefcase,
  Building,
  Heart,
  MoreHorizontal,
  Shield,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react'
import { ComponentType } from 'react'

// Mapping des classifications vers les icônes appropriées
export const getIconForClassification = (classificationId: string) => {
  const iconMap: Record<string, ComponentType<{ className?: string }>> = {
    legal: Shield,
    finance: Briefcase,
    insurance: Shield,
    hr: Users,
    healthcare: Heart,
    'real-estate': Building,
    business: Briefcase,
    specialist: UserPlus,
    // Anciens mappings pour compatibilité
    amoureux: Heart,
    famille: Users,
    ami: UserPlus,
    collègue: Briefcase,
    connaissance: Users,
    ex: UserMinus,
    autre: MoreHorizontal,
  }

  return iconMap[classificationId.toLowerCase()] || MoreHorizontal
}
