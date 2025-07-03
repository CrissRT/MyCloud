'use client';

import classNames from 'classnames';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@client/components';
import { faCheck, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface SingleSelectProps {
  multiple?: false;
  value?: string | number;
  onChange?: (value: string | number | undefined) => void;
  placeholder?: string;
}

interface MultiSelectProps {
  multiple: true;
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  placeholder?: string;
  maxSelections?: number;
}

interface BaseProps {
  label?: { text: string } & React.LabelHTMLAttributes<HTMLLabelElement>;
  error?: string;
  options: DropdownOption[];
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  button?: {
    children: React.ReactNode | string;
    showIcon?: true;
  };
  input?: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: (instance: HTMLInputElement | null) => void;
  };
}

type Props = BaseProps & (SingleSelectProps | MultiSelectProps);

// Helper function to create synthetic events for form integration
const createSyntheticEvent = (inputElement: HTMLInputElement, newValue: string) => {
  inputElement.value = newValue;
  return {
    target: inputElement,
    currentTarget: inputElement,
    type: 'change',
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    eventPhase: 2,
    isTrusted: true,
    nativeEvent: new Event('change'),
    preventDefault: () => {},
    isDefaultPrevented: () => false,
    stopPropagation: () => {},
    isPropagationStopped: () => false,
    persist: () => {},
    timeStamp: Date.now()
  };
};

export const Dropdown = ({
  label,
  error,
  options,
  disabled = false,
  clearable = false,
  searchable = false,
  size = 'md',
  input,
  button,
  ...selectProps
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAbove, setOpenAbove] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | (string | number)[] | undefined>(undefined);
  const { t } = useTranslation();

  const { multiple, value, onChange, placeholder } = selectProps;

  // Determine if we're in controlled mode or form integration mode
  const isControlled = value !== undefined;

  // Get the current value
  const currentValue = isControlled ? value : internalValue;

  // Initialize internal value from input.value on mount
  useEffect(() => {
    if (!isControlled && input?.value !== undefined) {
      if (multiple) {
        try {
          const parsed = JSON.parse(String(input.value));
          setInternalValue(Array.isArray(parsed) ? parsed : []);
        } catch {
          setInternalValue([]);
        }
      } else setInternalValue(String(input.value));
    }
  }, [isControlled, multiple, input?.value]);

  // Combined ref callback for react-hook-form integration
  const combinedRefCallback = (element: HTMLInputElement | null) => {
    if (input?.ref) input.ref(element);
    inputRef.current = element;
  };

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  // Get selected options for display
  const selectedOptions = multiple
    ? options.filter((option) => {
        if (Array.isArray(currentValue)) return currentValue.includes(option.value);

        return false;
      })
    : options.find((option) => option.value === currentValue);

  // Display text for the input
  const displayText = multiple
    ? Array.isArray(selectedOptions) && selectedOptions.length > 0
      ? selectedOptions.map((opt) => opt.label).join(', ')
      : placeholder || t('common.selectOptions')
    : selectedOptions && !Array.isArray(selectedOptions)
      ? selectedOptions.label
      : placeholder || t('common.selectOption');

  // Handle option selection
  const onOptionSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      const isSelected = currentValues.includes(option.value);

      let newValues: (string | number)[];
      if (isSelected) {
        newValues = currentValues.filter((v) => v !== option.value);
      } else {
        // Check maxSelections for multi-select
        if (multiple && 'maxSelections' in selectProps && selectProps.maxSelections) {
          if (currentValues.length >= selectProps.maxSelections) return; // Don't add more if max reached
        }
        newValues = [...currentValues, option.value];
      }

      // Update internal state
      if (!isControlled) setInternalValue(newValues);

      // Call onChange if provided (controlled mode)
      if (onChange && multiple && 'multiple' in selectProps && selectProps.multiple) onChange(newValues);

      // For react-hook-form integration
      if (input?.onChange && inputRef.current) {
        const syntheticEvent = createSyntheticEvent(inputRef.current, JSON.stringify(newValues));
        input.onChange(syntheticEvent);
      }
    } else {
      // Update internal state
      if (!isControlled) setInternalValue(option.value);

      // Call onChange if provided (controlled mode)
      if (onChange && !multiple && !('multiple' in selectProps)) onChange(option.value);

      setIsOpen(false);

      // For react-hook-form integration
      if (input?.onChange && inputRef.current) {
        const syntheticEvent = createSyntheticEvent(inputRef.current, String(option.value));
        input.onChange(syntheticEvent);
      }

      option.onClick?.();
    }
  };

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    setIsOpen((prev) => !prev);
  };
  // Handle clear selection
  const onClear = (e: React.MouseEvent) => {
    e.stopPropagation();

    const emptyValue = multiple ? [] : undefined;

    // Update internal state
    if (!isControlled) setInternalValue(emptyValue);

    // Call onChange if provided (controlled mode)
    if (onChange) {
      if (multiple && 'multiple' in selectProps && selectProps.multiple) onChange([]);
      else if (!multiple && !('multiple' in selectProps)) onChange(undefined);
    }

    // For react-hook-form integration
    if (input?.onChange && inputRef.current) {
      const newValue = multiple ? '[]' : '';
      const syntheticEvent = createSyntheticEvent(inputRef.current, newValue);
      input.onChange(syntheticEvent);
    }
  };

  // Handle remove single option in multi-select
  const onRemoveOption = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!multiple) return;

    const currentValues = Array.isArray(currentValue) ? currentValue : [];
    const newValues = currentValues.filter((v) => v !== optionValue);

    // Update internal state
    if (!isControlled) setInternalValue(newValues);

    // Call onChange if provided (controlled mode)
    if (onChange && 'multiple' in selectProps && selectProps.multiple) onChange(newValues);

    // For react-hook-form integration
    if (input?.onChange && inputRef.current) {
      const syntheticEvent = createSyntheticEvent(inputRef.current, JSON.stringify(newValues));
      input.onChange(syntheticEvent);
    }
  };

  // Click outside handler
  useEffect(() => {
    if (!isOpen) {
      setMeasured(false); // Reset measurement when closing
      return;
    }

    const onClickOutside = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current?.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  // Dropdown positioning
  useEffect(() => {
    if (!isOpen) return;

    // Only remeasure when dropdown is first opened, not when filtering
    if (!measured)
      setTimeout(() => {
        const container = containerRef.current;
        const dropdown = dropdownRef.current;
        if (container && dropdown) {
          const containerRect = container.getBoundingClientRect();
          const dropdownRect = dropdown.getBoundingClientRect();
          const spaceBelow = window.innerHeight - containerRect.bottom;
          const spaceAbove = containerRect.top;

          if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) setOpenAbove(true);
          else setOpenAbove(false);

          setMeasured(true);
          // Align to right if overflow on right
          const shouldAlignRight = containerRect.left + dropdownRect.width > window.innerWidth;
          setAlignRight(shouldAlignRight);
        }
      }, 0);
  }, [isOpen, measured]);

  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4',
    lg: 'py-4 px-5 text-lg'
  };

  return (
    <div className="mb-6 max-w-full relative" ref={containerRef}>
      {label && (
        <label htmlFor={input?.id || input?.name} {...label} className="block mb-2 text-(--text-primary)">
          {label.text}
        </label>
      )}

      <div className="relative w-full">
        {/* Hidden input for form integration */}
        <input
          {...input}
          ref={combinedRefCallback}
          type="hidden"
          value={multiple ? JSON.stringify(currentValue || []) : String(currentValue || '')}
        />

        {/* Display area */}
        {button?.children ? (
          <Button
            variant="text"
            align="left"
            onClick={onClick}
            disabled={disabled}
            icon={
              button.showIcon ? (
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={classNames('w-4 h-4 text-(--text-secondary)', { 'rotate-180': isOpen })}
                />
              ) : null
            }
          >
            {button?.children}
          </Button>
        ) : (
          <div
            className={classNames(
              'appearance-none w-full rounded-xl border border-(--border-color) focus-within:border-(--border-hover) bg-transparent text-(--text-primary) cursor-pointer outline-none flex items-center justify-between',
              sizeClasses[size],
              {
                'opacity-50 cursor-not-allowed': disabled,
                'border-(--border-hover)': isOpen
              }
            )}
            onClick={onClick}
          >
            <div className="flex-1 min-w-0">
              {multiple && Array.isArray(selectedOptions) && selectedOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-(--primary) text-white rounded text-sm"
                    >
                      {option.label}
                      <button
                        type="button"
                        onClick={(e) => onRemoveOption(option.value, e)}
                        className="hover:bg-(--primary-dark) rounded p-0.5"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span
                  className={classNames({
                    'text-(--text-secondary)':
                      !selectedOptions || (multiple && Array.isArray(selectedOptions) && selectedOptions.length === 0)
                  })}
                >
                  {displayText}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 ml-2">
              {clearable &&
                ((multiple && Array.isArray(currentValue) && currentValue.length > 0) ||
                  (!multiple && currentValue !== undefined)) && (
                  <button
                    type="button"
                    onClick={onClear}
                    className="text-(--text-secondary) hover:text-(--text-primary)"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                  </button>
                )}
              <FontAwesomeIcon
                icon={faChevronDown}
                className={classNames('w-4 h-4 text-(--text-secondary) transition-transform', {
                  'rotate-180': isOpen
                })}
              />
            </div>
          </div>
        )}

        {/* Dropdown menu */}
        {isOpen && !measured && (
          <div
            ref={dropdownRef}
            className="absolute z-50 left-0 right-0 bg-(--bg-color) border border-(--border-color) rounded-xl shadow-lg max-h-64 overflow-hidden"
            style={{ visibility: 'hidden', pointerEvents: 'none', left: '-9999px' }}
          >
            <div className="p-2">
              {filteredOptions.map((option) => (
                <div key={option.value} className="p-2">
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {isOpen && measured && (
          <div
            ref={dropdownRef}
            className={classNames(
              'absolute z-50 min-w-full bg-(--bg-color) border border-(--border-color) rounded-xl shadow-lg max-h-64 overflow-hidden animate-fade-in',
              {
                'left-0': !alignRight,
                'right-0': alignRight,
                'bottom-full mb-2': openAbove,
                'top-full mt-2': !openAbove
              }
            )}
          >
            {searchable && (
              <div className="p-3 border-b border-(--border-color)">
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-(--border-color) rounded-lg outline-none focus:border-(--border-hover) bg-transparent text-(--text-primary) placeholder-(--text-secondary)"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-(--text-secondary) text-center">
                  {searchable ? t('common.noResults') : t('common.noOptions')}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple
                    ? Array.isArray(currentValue) && currentValue.includes(option.value)
                    : currentValue === option.value;

                  return (
                    <div
                      key={option.value}
                      className={classNames(
                        'flex items-center justify-between p-3 cursor-pointer hover:bg-(--border-hover) transition-colors',
                        {
                          'opacity-50 cursor-not-allowed': option.disabled,
                          'bg-(--border-hover)': isSelected
                        }
                      )}
                      onClick={() => onOptionSelect(option)}
                    >
                      <span className="flex-1 text-(--text-primary)">{option.label}</span>
                      {isSelected && <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-(--primary)" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-(--error-color)">{error}</p>}
    </div>
  );
};
