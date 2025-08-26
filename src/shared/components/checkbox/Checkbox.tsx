import { ChangeEventHandler } from 'react'

export const Checkbox: React.FC<{
  tabIndex: number
  id: string
  ariaLabel: string
  checked: boolean
  onChange: ChangeEventHandler<HTMLInputElement> | undefined
}> = ({ tabIndex, id, ariaLabel, checked, onChange }) => {
  return (
    <label className='label cursor-pointer w-fit ' htmlFor={id}>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        className='checkbox checkbox-sm border border-muted-foreground  checked:bg-primary focus:ring-2 focus:ring-accent'
      />
    </label>
  )
}
