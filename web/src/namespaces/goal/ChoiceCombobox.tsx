import { Combobox, Group, Input, Pill, PillsInput, Text, useCombobox } from '@mantine/core'
import { ReactNode, useEffect, useState } from 'react'

// Option type definition
export interface ChoiceOption {
  value: string
  label: string
  content?: NonNullable<ReactNode>
}

interface ChoiceComboboxProps {
  options: ChoiceOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
}

export function ChoiceCombobox(props: ChoiceComboboxProps) {
  const {
    options = [],
    value: externalValue = [],
    onChange,
    placeholder = 'Pick one or more values',
  } = props

  // Initialize combobox with proper configuration
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [search, setSearch] = useState('')
  const [selectedValues, setSelectedValues] = useState<string[]>(externalValue)

  // Keep internal state in sync with external value
  useEffect(() => {
    setSelectedValues(externalValue)
  }, [externalValue])

  // Handle selecting an option
  const handleOptionSubmit = (val: string) => {
    const newValues = selectedValues.includes(val)
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val]

    setSelectedValues(newValues)
    onChange?.(newValues)
    setSearch('')
  }

  // Handle removing a selected value
  const handleValueRemove = (val: string) => {
    const newValues = selectedValues.filter((v) => v !== val)
    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  // Filter options: first remove selected values, then filter by search text
  const filteredOptions = options
    .filter(option => !selectedValues.includes(option.value)) // Hide already selected options
    .filter(option =>
      option.label.toString().toLowerCase().includes(search.toLowerCase())
    )

  const selectedItems = selectedValues.map((value) => {
    const option = options.find((opt) => opt.value === value)

    return (
      <Pill
        key={value}
        withRemoveButton
        onRemove={() => handleValueRemove(value)}
      >
        {option ?
          option.content ?
            option.content
            : option.label
          : value}
      </Pill>
    )
  })

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleOptionSubmit}
      withinPortal={true}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          onClick={() => combobox.openDropdown()}
          rightSection={<Combobox.Chevron />}
        >
          <Pill.Group>
            {selectedItems}

            <Combobox.EventsTarget>
              <PillsInput.Field
                value={search}
                onChange={(e) => {
                  setSearch(e.currentTarget.value)
                  combobox.openDropdown()
                }}
                placeholder={selectedItems.length === 0 ? placeholder : undefined}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => {
                  combobox.closeDropdown()
                  setSearch('')
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {filteredOptions.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            filteredOptions.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option.value}
                selected={selectedValues.includes(option.value)}
              >
                {option.content ?? <Text size="sm">{option.label}</Text>}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}