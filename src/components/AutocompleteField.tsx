import React, { useState, useEffect, useCallback } from 'react'
import { useField, useFormFields } from 'payload/components/forms'
import { TextInput } from 'payload/components/forms'
import './AutocompleteField.css' // We will create this for basic styling

interface Option {
  label: string
  value: string
}

interface AutocompleteFieldProps {
  path: string
  label: string
  listName: string // e.g., 'category.json', 'type.json', 'area.json'
  required?: boolean
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  path,
  label,
  listName,
  required,
}) => {
  const { value, setValue } = useField<string>({ path })
  const [inputValue, setInputValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState<Option[]>([])
  const [allOptions, setAllOptions] = useState<Option[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { dispatchFields } = useFormFields()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/lists/${listName}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${listName}: ${response.statusText}`)
      }
      const data: Option[] = await response.json()
      setAllOptions(data)
      // If there's an existing value, try to set inputValue to its label
      if (value) {
        const currentOption = data.find((opt) => opt.value === value)
        if (currentOption) {
          setInputValue(currentOption.label)
        } else {
          setInputValue(value) // Fallback to value if label not found (e.g. old data)
        }
      }
    } catch (e: any) {
      setError(e.message || 'Error fetching data')
      console.error(e)
    }
    setIsLoading(false)
  }, [listName, value])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Effect to update field value when inputValue matches an option's label
  // and also to update the main form state if a selection is made.
  useEffect(() => {
    const matchedOption = allOptions.find(
      (opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
    )
    if (matchedOption) {
      if (value !== matchedOption.value) {
        setValue(matchedOption.value)
      }
    }
  }, [inputValue, allOptions, setValue, value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.target.value
    setInputValue(currentInput)

    if (currentInput) {
      const filteredSuggestions = allOptions.filter((option) =>
        option.label.toLowerCase().includes(currentInput.toLowerCase()),
      )
      setSuggestions(filteredSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setValue('') // Clear the field value if input is cleared
    }
  }

  const handleSuggestionClick = (suggestion: Option) => {
    setInputValue(suggestion.label)
    setValue(suggestion.value)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleCreateNew = async () => {
    if (!inputValue.trim()) return

    const newOptionValue = inputValue.trim().toLowerCase().replace(/\s+/g, '_')
    const newOption: Option = {
      label: inputValue.trim(),
      value: newOptionValue,
    }

    // Check if it already exists by label or value (case-insensitive)
    const exists = allOptions.some(
      (opt) =>
        opt.label.toLowerCase() === newOption.label.toLowerCase() ||
        opt.value.toLowerCase() === newOption.value.toLowerCase(),
    )

    if (exists) {
      // If it exists, treat it as a selection
      const existingOption = allOptions.find(
        (opt) =>
          opt.label.toLowerCase() === newOption.label.toLowerCase() ||
          opt.value.toLowerCase() === newOption.value.toLowerCase(),
      )
      if (existingOption) {
        handleSuggestionClick(existingOption)
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/lists/${listName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOption),
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || `Failed to create new option in ${listName}`)
      }
      const updatedOptions: Option[] = await response.json()
      setAllOptions(updatedOptions)
      setInputValue(newOption.label)
      setValue(newOption.value) // This updates the Payload field state
      setShowSuggestions(false)
      setSuggestions([])
      // Manually trigger a change in Payload's form state if needed for immediate reflection
      dispatchFields({ type: 'UPDATE', path, value: newOption.value })
    } catch (e: any) {
      setError(e.message || 'Error creating option')
      console.error(e)
    }
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent form submission
      if (suggestions.length === 1) {
        handleSuggestionClick(suggestions[0])
      } else if (
        inputValue.trim() &&
        !allOptions.find((opt) => opt.label.toLowerCase() === inputValue.trim().toLowerCase())
      ) {
        // If no exact match suggestion and input is not empty, offer to create
        handleCreateNew()
      } else if (suggestions.length === 0 && inputValue.trim()) {
        handleCreateNew()
      }
    }
  }

  return (
    <div className="custom-autocomplete-field">
      <label htmlFor={path} className="field-label">
        {label}
        {required ? '*' : ''}
      </label>
      <div className="autocomplete-input-wrapper">
        <TextInput
          path={path} // TextInput needs path for its own state, but we control value via inputValue
          name={path} // HTML name attribute
          value={inputValue} // Controlled component for display
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)} // Show suggestions on focus if there's text
          // onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay to allow click
          placeholder={`Type to search or add new...`}
          required={required}
          classNamePrefix="custom-autocomplete"
        />
        {showSuggestions && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.value}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseDown={(e) => e.preventDefault()} // Prevents onBlur from firing before click
              >
                {suggestion.label}
              </li>
            ))}
            {inputValue &&
              !suggestions.some((s) => s.label.toLowerCase() === inputValue.toLowerCase()) && (
                <li
                  onClick={handleCreateNew}
                  onMouseDown={(e) => e.preventDefault()} // Prevents onBlur from firing before click
                  className="create-new-option"
                >
                  Create new option: "{inputValue}"
                </li>
              )}
          </ul>
        )}
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="field-error">Error: {error}</p>}
      {/* Hidden input to actually store the selected value for Payload, if TextInput doesn't do it directly via setValue */}
      {/* <input type="hidden" name={path} value={value || ''} /> */}
      {/* Using setValue from useField should handle payload's state. 
          TextInput also uses useField internally, so direct control via inputValue and then setValue for the actual field value is key. 
      */}
    </div>
  )
}

export default AutocompleteField
