import { cnTableHeadColors } from '../../styles/Table.style'

export const TableHeaderCell: React.FC<{
  title: string
  icon: React.ReactNode
  className?: string
}> = ({ title, icon, className }) => {
  return (
    <th className={`${cnTableHeadColors} ${className}`}>
      <span className='flex items-center gap-2 w-full h-full'>
        {icon}
        <span>{title}</span>
      </span>
    </th>
  )
}
