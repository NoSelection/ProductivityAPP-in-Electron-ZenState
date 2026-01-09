import { useState } from 'react'

// Custom event for storage errors
export const STORAGE_ERROR_EVENT = 'local-storage-error'

export interface StorageErrorDetail {
    key: string
    error: unknown
    type: 'read' | 'write'
}

function dispatchStorageError(key: string, error: unknown, type: 'read' | 'write') {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent<StorageErrorDetail>(STORAGE_ERROR_EVENT, {
                detail: { key, error, type },
            })
        )
    }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window === 'undefined') {
                return initialValue
            }
            // Get from local storage by key
            const item = window.localStorage.getItem(key)
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            // If error also return initialValue
            console.error(`Error reading localStorage key "${key}":`, error)
            dispatchStorageError(key, error, 'read')
            return initialValue
        }
    })

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            // Save state
            setStoredValue(valueToStore)
            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(`Error writing localStorage key "${key}":`, error)
            dispatchStorageError(key, error, 'write')
        }
    }

    return [storedValue, setValue] as const
}
