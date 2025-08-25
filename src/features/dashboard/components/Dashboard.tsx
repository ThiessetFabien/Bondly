'use client'

import {
  Building2,
  Contact,
  MessageSquare,
  Star,
  User,
  Users,
} from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { Table } from '../../../components/ui/table'
import Badge from '../../../shared/components/badges/Badge'
import { Checkbox } from '../../../shared/components/checkbox/Checkbox'
import OverlayButton from '../../../shared/components/overlays/OverlayButton'
import OverlayCard from '../../../shared/components/overlays/OverlayCard'

import { cn } from '../../../services/lib/utils'
import { ActionLinkButton } from '../../../shared/components/buttons/ActionLinkButton'
import { Email } from '../../../shared/components/icons/Email.svg'
import { Phone } from '../../../shared/components/icons/Phone.svg'
import { Relation } from '../../../shared/components/icons/Relation.svg'
import { cnIcon } from '../../../shared/styles/icons.styles'
import type { Partner, PartnersTableProps } from '../../../shared/types/Partner'
import {
  allFirstLetterToUpperCase,
  oneFirstLetterToUpperCase,
} from '../../../shared/utils/formatStrings'
import { ALL_COLUMNS } from '../contants/constants'
import { useSortedPartners } from '../hooks/sortedPartners'
import { cnTableHeadColors } from '../styles/Table.style'
import { TableHeaderCell } from './desktop/TableHeaderCell'
import { CompanyAndNameCell } from './mobile/CompanyAndNameCell'
import { SettingsDashboard } from './SettingsDashboard'

import { useDashboard } from '@/store/context/DashboardContext'

const Dashboard: React.FC<PartnersTableProps> = props => {
  const context = useDashboard()
  const selectedRows = props.selectedRows ?? context.state.selectedRows
  const onSelectionChange =
    props.onSelectionChange ??
    ((rows: string[]) =>
      context.dispatch({ type: 'SET_SELECTED_ROWS', payload: rows }))
  const visibleColumns = ALL_COLUMNS
  const { sortedPartners } = useSortedPartners()

  // Ref pour la checkbox d’en-tête
  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  // Gestion sélection multi-lignes
  const handleRowSelect = (id: string, checked: boolean) => {
    let updated: string[]
    if (checked) {
      // Retire l'id s'il est déjà présent pour éviter les doublons
      updated = [...selectedRows.filter(rowId => rowId !== id), id]
    } else {
      updated = selectedRows.filter(rowId => rowId !== id)
    }
    onSelectionChange?.(updated)
  }

  // Effet pour gérer l’état indeterminate de la checkbox d’en-tête
  useEffect(() => {
    if (!headerCheckboxRef.current) return
    if (
      selectedRows.length > 0 &&
      selectedRows.length < sortedPartners.length
    ) {
      headerCheckboxRef.current.indeterminate = true
    } else {
      headerCheckboxRef.current.indeterminate = false
    }
  }, [selectedRows, sortedPartners.length])

  const cnBorderTable = 'border-l border-accent'

  return (
    <>
      {/* Actions principales (desktop & mobile) */}
      <SettingsDashboard />
      <section className='flex-1 overflow-x-auto min-h-0 max-h-[calc(100dvh-60px)]'>
        <Table className='table table-zebra rounded-box bg-base-100 h-full w-full table-fixed'>
          <thead>
            <tr className='hidden sm:table-row align-middle'>
              <th
                className={`w-[36px] min-w-[32px] max-w-[40px] align-middle text-center p-0 ${cnTableHeadColors}`}
              >
                <input
                  ref={headerCheckboxRef}
                  id='dashboard-header-checkbox'
                  type='checkbox'
                  className='checkbox checkbox-sm align-middle'
                  checked={
                    selectedRows.length === sortedPartners.length &&
                    sortedPartners.length > 0
                  }
                  onChange={e => {
                    if (e.target.checked) {
                      onSelectionChange?.(sortedPartners.map(p => p.id))
                    } else {
                      onSelectionChange?.([])
                    }
                  }}
                  aria-label='Sélectionner tout'
                />
              </th>
              {visibleColumns.includes('Entreprise') && (
                <TableHeaderCell
                  title='Entreprise'
                  icon={<Building2 className={cnIcon} />}
                  className={`w-[12vw] align-middle text-left font-bold text-secondary-content truncate ${cnBorderTable}`}
                />
              )}
              {visibleColumns.includes('Notation') && (
                <TableHeaderCell
                  title='Notation'
                  icon={<Star className={cnIcon} />}
                  className={`w-[8vw] align-middle text-left font-bold text-secondary-content truncate ${cnBorderTable}`}
                />
              )}
              {visibleColumns.includes('Interlocuteur') && (
                <TableHeaderCell
                  title='Interlocuteur'
                  icon={<User className={cnIcon} />}
                  className={`w-[14vw] align-middle text-left font-bold text-secondary-content truncate ${cnBorderTable}`}
                />
              )}
              {/* Nouvelle colonne Contact (desktop uniquement) */}
              {visibleColumns.includes('Contacts') && (
                <TableHeaderCell
                  title='Contacts'
                  icon={<Contact className={cnIcon} />}
                  className={`w-[8vw] align-middle text-left font-bold text-secondary-content truncate ${cnBorderTable}`}
                />
              )}
              {visibleColumns.includes('Relations') && (
                <TableHeaderCell
                  title='Relations'
                  icon={<Users className={cnIcon} />}
                  className={`w-[8vw] align-middle text-left font-bold text-secondary-content truncate ${cnBorderTable}`}
                />
              )}
            </tr>
          </thead>
          <tbody className='h-full w-full table-fixed align-middle'>
            {sortedPartners.length ? (
              sortedPartners.map((partner: Partner) => (
                <tr
                  key={partner.id}
                  tabIndex={0}
                  aria-label={`Ligne partenaire ${partner.company}`}
                  role='row'
                  className='table-row'
                >
                  <td className='align-middle table-cell h-full items-center w-5 min-w-[24px] max-w-[40px] px-0 sm:px-4'>
                    <Checkbox
                      id={`partner-checkbox-${partner.id}`}
                      checked={selectedRows.includes(partner.id)}
                      onChange={e =>
                        handleRowSelect(partner.id, e.target.checked)
                      }
                      ariaLabel={`Sélectionner ${partner.company}`}
                      tabIndex={0}
                    />
                  </td>
                  {/* MOBILE : 2 colonnes synthétiques */}
                  <td className='sm:hidden table-cell min-w-[80px] pr-0 pl-2 sm:pl-4 sm:pr-4'>
                    <CompanyAndNameCell partner={partner} />
                  </td>
                  <td className='sm:hidden table-cell align-middle h-full flex-wrap space-y-1 w-[40px] text-right flex-col p-0 sm:py-3 sm:px-4'>
                    <ActionLinkButton
                      icon={<Email className={cnIcon} />}
                      title=''
                      variant='square'
                      href={`mailto:${partner.email}`}
                      ariaLabel={`Envoyer un email à ${partner.firstName} ${partner.lastName}`}
                      rôle='button'
                      tabIndex={0}
                    />
                    <ActionLinkButton
                      icon={<Phone className={cnIcon} />}
                      title=''
                      variant='circle'
                      href={`tel:${partner.phone}`}
                      ariaLabel={`Appeler ${partner.firstName} ${partner.lastName}`}
                      rôle='button'
                      tabIndex={0}
                    />
                  </td>
                  {/* Desktop: colonnes classiques */}
                  {visibleColumns.includes('Entreprise') && (
                    <td
                      className={`hidden sm:table-cell py-2 px-2 sm:px-3 min-w-[160px] max-w-[240px] w-[22vw] ${cnBorderTable}`}
                    >
                      <div className='flex flex-col justify-center min-w-0'>
                        <span className='font-bold md:text-base lg:text-lg text-secondary-content truncate block min-w-0'>
                          {allFirstLetterToUpperCase(partner.company)}
                        </span>
                        {partner.classifications?.length > 0 && (
                          <div className='flex flex-wrap gap-1 mt-1 min-w-0'>
                            {[...partner.classifications]
                              .sort((a, b) => a.localeCompare(b))
                              .map(classification => (
                                <Badge
                                  key={classification}
                                  color='info'
                                  size='xs'
                                  px='px-2'
                                  className='badge-soft capitalize whitespace-nowrap'
                                >
                                  {classification}
                                </Badge>
                              ))}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes('Notation') && (
                    <td
                      className={`hidden sm:table-cell align-middle py-2 px-2 min-w-[90px] max-w-[110px] w-[8vw] ${cnBorderTable}`}
                    >
                      <div className='flex w-full justify-between items-center gap-2'>
                        <span className='flex items-center'>
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`mask mask-star-2 w-4 sm:w-5 h-4 sm:h-5 ${i < Math.round(partner.rating) ? 'bg-primary' : 'bg-base-300'}`}
                              aria-label={`${i + 1} étoile${i > 0 ? 's' : ''}`}
                            />
                          ))}
                        </span>
                        {/* Overlay commentaire déplacé ici */}
                        <OverlayButton
                          icon={
                            <MessageSquare
                              className={cn(cnIcon, 'text-primary')}
                            />
                          }
                          ariaLabel='Lire le commentaire'
                          title='Lire le commentaire'
                          overlayContent={
                            <OverlayCard
                              title='Commentaire'
                              icon={
                                <MessageSquare
                                  className={cn(cnIcon, 'text-primary')}
                                />
                              }
                              className='z-50 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100'
                              usePortal={true}
                            >
                              <p className='text-sm text-base-content/90 whitespace-pre-line'>
                                {oneFirstLetterToUpperCase(partner.notes) || (
                                  <span className='italic text-base-content/60'>
                                    Aucun commentaire
                                  </span>
                                )}
                              </p>
                            </OverlayCard>
                          }
                          className='ml-1'
                        />
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes('Interlocuteur') && (
                    <>
                      <td
                        className={`hidden sm:table-cell align-middle py-2 px-2 min-w-[130px] max-w-[200px] w-[16vw] ${cnBorderTable}`}
                      >
                        <div className='flex flex-row items-stretch gap-1 h-full min-w-0'>
                          {/* Infos interlocuteur */}
                          <div className='flex flex-col justify-center flex-1 min-w-0'>
                            <span className='font-bold text-base text-secondary-content truncate block min-w-0'>
                              {oneFirstLetterToUpperCase(partner.lastName)}{' '}
                              {oneFirstLetterToUpperCase(partner.firstName)}
                            </span>
                            <Badge
                              color='accent'
                              size='sm'
                              px='px-2'
                              className='badge-soft mt-1 align-middle whitespace-nowrap'
                            >
                              <span className='truncate'>
                                {allFirstLetterToUpperCase(partner.profession)}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </td>
                      {/* Nouvelle colonne Contact (desktop uniquement) */}
                      <td
                        className={`hidden sm:table-cell align-middle space-x-2 p-2 min-w-[90px] max-w-[110px] w-[8vw] ${cnBorderTable}`}
                      >
                        <ActionLinkButton
                          icon={<Email className='h-3 -translate-y-0.5' />}
                          href={`mailto:${partner.email}`}
                          ariaLabel={`Envoyer un email à ${partner.firstName} ${partner.lastName}`}
                          rôle='button'
                          className='text-nowrap text-accent-foreground text-xs w-auto px-2 py-1'
                        />
                        <ActionLinkButton
                          title={partner.phone}
                          variant='circle'
                          icon={<Phone className='h-3 -translate-y-0.5' />}
                          href={`tel:${partner.phone}`}
                          ariaLabel={`Appeler ${partner.firstName} ${partner.lastName}`}
                          rôle='button'
                          className='text-nowrap text-accent-foreground text-xs w-auto px-2 py-1'
                        />
                      </td>
                    </>
                  )}
                  {visibleColumns.includes('Relations') && (
                    <td
                      className={`hidden sm:table-cell align-middle py-2 px-2 min-w-[90px] max-w-[140px] w-[14vw] ${cnBorderTable}`}
                    >
                      <div className='flex flex-row items-stretch gap-1.5 md:gap-2 h-full'>
                        <div className='flex items-center h-full self-center'>
                          <div>
                            <OverlayButton
                              icon={<Users className='w-5 h-5' />}
                              ariaLabel='Voir les relations'
                              title='Voir les relations'
                              overlayContent={
                                <OverlayCard
                                  title={`Relations de ${partner.company}`}
                                  icon={<Users className='w-5 h-5' />}
                                  className='z-50 sm:w-[900px] sm:max-w-4xl sm:overflow-y-auto sm:max-h-[60vh] scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100'
                                  usePortal={true}
                                >
                                  {Array.isArray(partner.relations) &&
                                  partner.relations.length > 0 ? (
                                    <div className='mt-1 w-full'>
                                      {/* Desktop grid améliorée */}
                                      <div className='grid grid-cols-3 gap-y-2 gap-x-4'>
                                        {/* En-têtes de colonne */}
                                        <div className='col-span-1 font-semibold text-xs text-secondary/70 uppercase tracking-wide pb-1 pr-2'>
                                          Entreprise
                                        </div>
                                        <div className='col-span-1 font-semibold text-xs text-secondary/70 uppercase tracking-wide pb-1 pr-2'>
                                          Contact
                                        </div>
                                        <div className='col-span-1 font-semibold text-xs text-secondary/70 uppercase tracking-wide pb-1'>
                                          Type
                                        </div>
                                        {/* Relations */}
                                        {(partner.relations ?? []).map(
                                          (rel, idx) => (
                                            <React.Fragment key={rel.id}>
                                              <div className='flex items-center gap-2 min-w-0 pr-2'>
                                                <Users className='inline w-4 h-4 text-accent shrink-0' />
                                                <span className='truncate text-base font-medium text-secondary-content'>
                                                  {rel.company}
                                                </span>
                                              </div>
                                              <div className='flex items-center gap-2 min-w-0 pr-2'>
                                                <span className='inline-block rounded-full bg-primary/10 p-1 mr-1'>
                                                  <User className='w-3.5 h-3.5 text-primary' />
                                                </span>
                                                <span className='truncate text-sm font-semibold text-primary-content'>
                                                  {rel.name}
                                                </span>
                                              </div>
                                              <div className='flex items-center'>
                                                <span
                                                  className={`badge badge-md px-3 capitalize ${rel.type === 'collaboration' ? 'badge-info' : rel.type === 'recommandation' ? 'badge-success' : 'badge-secondary'}`}
                                                >
                                                  {rel.type}
                                                </span>
                                              </div>
                                              {/* Séparateur visuel entre les lignes sauf la dernière */}
                                              {idx <
                                                (partner.relations?.length ??
                                                  0) -
                                                  1 && (
                                                <div className='col-span-3 border-b border-base-200 my-1' />
                                              )}
                                            </React.Fragment>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className='flex flex-col items-center justify-center py-8'>
                                      <Users className='w-8 h-8 text-secondary/30 mb-2' />
                                      <span className='text-xs text-secondary/60'>
                                        Aucune mise en relation
                                      </span>
                                    </div>
                                  )}
                                </OverlayCard>
                              }
                              badgeContent={partner.relations?.length ?? 0}
                            />
                          </div>
                        </div>
                        <div className='flex flex-row items-center justify-end gap-1 h-full self-center'>
                          <button
                            className='btn btn-circle h-9 w-9 min-h-0 text-accent border-base-300 bg-base-100 hover:bg-accent/10 shadow-sm'
                            title='Ajouter une relation'
                            aria-label='Ajouter une relation'
                            // TODO: Ajouter une relation
                            type='button'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth='2.2'
                              stroke='currentColor'
                              className='size-[1.2em] text-primary'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M12 6v12m6-6H6'
                              />
                            </svg>
                          </button>
                          <button
                            className='btn btn-circle h-9 w-9 min-h-0 text-accent border-base-300 bg-base-100 hover:bg-accent/10 shadow-sm'
                            title='Modifier une relation'
                            aria-label='Modifier une relation'
                            // TODO: Modifier une relation
                            type='button'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth='2.2'
                              stroke='currentColor'
                              className='size-[1.2em] text-primary'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M16.862 5.487a2.1 2.1 0 1 1 2.97 2.97L8.5 19.79l-4 1 1-4 11.362-11.303z'
                              />
                            </svg>
                          </button>
                          <button
                            className='btn btn-circle h-9 w-9 min-h-0 text-accent border-base-300 bg-base-100 hover:bg-accent/10 shadow-sm'
                            title='Archiver une relation'
                            aria-label='Archiver une relation'
                            // TODO: Archiver une relation
                            type='button'
                          >
                            <Relation />
                          </button>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={ALL_COLUMNS.length} className='text-center py-6'>
                  Aucun résultat
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </section>
    </>
  )
}
Dashboard.displayName = 'Dashboard'

export { Dashboard }
