import React, { useState, useRef, useEffect } from 'react';

const MultiSelect = ({ options, value, onChange, label, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeTag = (e, optionValue) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  return (
    <div className="relative group" ref={wrapperRef}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          min-h-[46px] w-full bg-white border rounded-xl px-4 py-2.5 cursor-pointer 
          flex flex-wrap gap-2 items-center justify-between transition-all duration-200
          ${isOpen
            ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg shadow-blue-500/5'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
          }
        `}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {value.length > 0 ? (
            value.map(v => {
              const option = options.find(o => o.value === v);
              return (
                <span
                  key={v}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 text-blue-700 text-sm px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all hover:border-blue-200 hover:shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {option?.label}
                  <button
                    type="button"
                    onClick={(e) => removeTag(e, v)}
                    className="hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors focus:outline-none"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-gray-400 font-medium">{placeholder}</span>
          )}
        </div>
        <div className="text-gray-400 pl-2">
          <svg
            className={`w-5 h-5 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-gray-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div className={`
        absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col transition-all duration-200 origin-top
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
      `}>
        <div className="p-3 border-b border-gray-50 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Search processes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-8 text-sm text-gray-400 text-center flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No options found
            </div>
          ) : (
            filteredOptions.map(option => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 group/item
                      ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'}
                    `}
                >
                  <div className={`
                      w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
                      ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white group-hover/item:border-blue-400'}
                    `}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
