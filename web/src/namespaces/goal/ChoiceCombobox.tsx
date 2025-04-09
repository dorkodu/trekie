import { Combobox, Input, Pill, PillsInput, useCombobox } from '@mantine/core'
import { ReactNode, useEffect, useState } from 'react'

// Fixed option type with value and label
interface OptionType {
  value: string
  label: ReactNode
}

interface ChoiceComboboxProps {
  options: OptionType[]
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
}

export function ChoiceCombobox(props: ChoiceComboboxProps) {
  const {
    options = [],
    value: externalValue,
    onChange,
    placeholder = 'Pick one or more values',
  } = props

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [internalValue, setInternalValue] = useState<string[]>(externalValue || [])

  // Sync with external value when it changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue)
    }
  }, [externalValue])

  // Value handling logic
  const value = externalValue !== undefined ? externalValue : internalValue

  const handleValueSelect = (val: string) => {
    const newValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val]

    // Update internal state if uncontrolled
    if (externalValue === undefined) {
      setInternalValue(newValue)
    }

    // Notify parent component
    onChange?.(newValue)
  }

  const handleValueRemove = (val: string) => {
    const newValue = value.filter((v) => v !== val)

    // Update internal state if uncontrolled
    if (externalValue === undefined) {
      setInternalValue(newValue)
    }

    // Notify parent component
    onChange?.(newValue)
  }

  // Find option by value
  const findOptionByValue = (val: string): OptionType | undefined => {
    return options.find(opt => opt.value === val)
  }

  // Create pills for selected values
  const values = value.map((itemValue) => {
    const option = findOptionByValue(itemValue)

    return (
      <Pill key={itemValue} withRemoveButton onRemove={() => handleValueRemove(itemValue)}>
        {option ? option.label : itemValue}
      </Pill>
    )
  })

  // Create options for dropdown
  const optionElements = options
    .filter((item) => !value.includes(item.value))
    .map((item) => (
      <Combobox.Option
        value={item.value}
        key={item.value}
        active={value.includes(item.value)}
      >
        {item.label}
      </Combobox.Option>
    ))

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput pointer onClick={() => combobox.toggleDropdown()}>
          <Pill.Group>
            {values.length > 0 ? (
              values
            ) : (
              <Input.Placeholder>{placeholder}</Input.Placeholder>
            )}

            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && value && value.length > 0) {
                    e.preventDefault()
                    handleValueRemove(value[value.length - 1])
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {optionElements.length === 0 ? <Combobox.Empty>All options selected</Combobox.Empty> : optionElements}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}