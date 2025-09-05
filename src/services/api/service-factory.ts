import type { IPartnerService } from './interfaces'
import { PartnerService } from './partners'

/**
 * Factory pour créer les services avec les bonnes dépendances
 * Version MVP simplifiée
 */
export class ServiceFactory {
  private static partnerServiceInstance: IPartnerService | null = null

  /**
   * Crée ou retourne l'instance du service des partenaires
   */
  static getPartnerService(): IPartnerService {
    if (!this.partnerServiceInstance) {
      this.partnerServiceInstance = new PartnerService()
    }
    return this.partnerServiceInstance
  }

  /**
   * Réinitialise les instances (utile pour les tests)
   */
  static reset(): void {
    this.partnerServiceInstance = null
  }
}
