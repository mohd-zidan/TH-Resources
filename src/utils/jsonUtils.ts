import fs from 'fs/promises'
import path from 'path'

const dataDir = path.resolve(process.cwd(), 'data')

interface JsonOption {
  label: string
  value: string
}

export const getJsonOptions = async (fileName: string): Promise<JsonOption[]> => {
  try {
    const filePath = path.join(dataDir, fileName)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent) as JsonOption[]
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error)
    return [] // Return empty array or throw error as per fallback UI requirement
  }
}

export const addJsonOption = async (fileName: string, newOption: JsonOption): Promise<void> => {
  try {
    const filePath = path.join(dataDir, fileName)
    const options = await getJsonOptions(fileName)

    // Check if option already exists (case-insensitive check for label or value)
    const existingOption = options.find(
      (opt) =>
        opt.label.toLowerCase() === newOption.label.toLowerCase() ||
        opt.value.toLowerCase() === newOption.value.toLowerCase(),
    )

    if (existingOption) {
      console.log(`Option ${newOption.label} already exists in ${fileName}.`)
      return // Or throw an error / return a specific status
    }

    options.push(newOption)
    await fs.writeFile(filePath, JSON.stringify(options, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Error writing to ${fileName}:`, error)
    throw error // Rethrow to be handled by the caller
  }
}
