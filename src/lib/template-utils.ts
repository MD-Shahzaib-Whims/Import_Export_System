import { exportToExcel } from "./excel-utils"
import type { ColumnConfig, ImporterConfig } from "./types"
import * as XLSX from "xlsx"

/**
 * Generates sample data based on column configuration
 */
export function generateSampleData(config: ImporterConfig, rowCount = 3): any[] {
    const sampleData = []

    for (let i = 0; i < rowCount; i++) {
        const row: Record<string, any> = {}

        config.columns.forEach((column) => {
            row[column.name] = generateSampleValue(column, i)
        })

        sampleData.push(row)
    }

    return sampleData
}

/**
 * Generates a sample value for a specific column and row
 */
function generateSampleValue(column: ColumnConfig, rowIndex: number): any {
    const { type, name } = column

    // Generate different values for each row to show variety
    switch (type) {
        case "string":
            if (name.toLowerCase().includes("name")) {
                const names = ["John Smith", "Jane Doe", "Alex Johnson"]
                return names[rowIndex % names.length]
            } else if (name.toLowerCase().includes("title")) {
                const titles = ["Project Manager", "Developer", "Designer"]
                return titles[rowIndex % titles.length]
            } else if (name.toLowerCase().includes("department")) {
                const departments = ["Engineering", "Marketing", "HR"]
                return departments[rowIndex % departments.length]
            } else if (name.toLowerCase().includes("address")) {
                const addresses = ["123 Main St", "456 Oak Ave", "789 Pine Blvd"]
                return addresses[rowIndex % addresses.length]
            } else {
                return `Sample ${name} ${rowIndex + 1}`
            }

        case "number":
            if (name.toLowerCase().includes("age")) {
                return 25 + rowIndex * 5
            } else if (name.toLowerCase().includes("price") || name.toLowerCase().includes("cost")) {
                return (19.99 + rowIndex * 10).toFixed(2)
            } else if (name.toLowerCase().includes("quantity") || name.toLowerCase().includes("count")) {
                return 5 + rowIndex * 3
            } else if (name.toLowerCase().includes("salary")) {
                return 50000 + rowIndex * 10000
            } else {
                return 100 + rowIndex * 50
            }

        case "date":
            const date = new Date()
            date.setDate(date.getDate() + rowIndex * 7) // Different dates for each row
            return date.toISOString().split("T")[0] // YYYY-MM-DD format

        case "boolean":
            return rowIndex % 2 === 0 // Alternate true/false

        case "email":
            const domains = ["example.com", "company.org", "business.net"]
            return `user${rowIndex + 1}@${domains[rowIndex % domains.length]}`

        case "phone":
            return `(555) ${100 + rowIndex}-${1000 + rowIndex * 111}`

        default:
            return `Sample ${rowIndex + 1}`
    }
}

/**
 * Exports a template file in the specified format
 */
export function exportTemplate(config: ImporterConfig, format: string, fileName = "template"): void {
    const sampleData = generateSampleData(config)

    switch (format.toLowerCase()) {
        case "excel":
        case "xlsx":
            exportToExcel(sampleData, fileName)
            break

        case "csv":
            exportToCSV(sampleData, fileName)
            break

        case "json":
            exportToJSON(sampleData, fileName)
            break

        default:
            exportToExcel(sampleData, fileName)
    }
}

/**
 * Exports data to a CSV file
 */
function exportToCSV(data: any[], fileName: string): void {
    try {
        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data)

        // Create a workbook with the worksheet
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

        // Generate CSV and trigger download
        XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: "csv" })
    } catch (error) {
        console.error("Error exporting to CSV:", error)
        throw error
    }
}

/**
 * Exports data to a JSON file
 */
function exportToJSON(data: any[], fileName: string): void {
    try {
        // Convert data to JSON string
        const jsonString = JSON.stringify(data, null, 2)

        // Create a blob with the JSON data
        const blob = new Blob([jsonString], { type: "application/json" })

        // Create a download link and trigger download
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${fileName}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error("Error exporting to JSON:", error)
        throw error
    }
}

/**
 * Generates a template description based on configuration
 */
export function generateTemplateDescription(config: ImporterConfig): string {
    const requiredColumns = config.columns.filter((col) => col.required)
    const optionalColumns = config.columns.filter((col) => !col.required)

    let description = "This template includes the following fields:\n\n"

    if (requiredColumns.length > 0) {
        description += "Required Fields:\n"
        requiredColumns.forEach((col) => {
            description += `- ${col.displayName || col.name} (${getTypeDescription(col.type)})`
            if (col.description) description += `: ${col.description}`
            description += "\n"
        })
        description += "\n"
    }

    if (optionalColumns.length > 0) {
        description += "Optional Fields:\n"
        optionalColumns.forEach((col) => {
            description += `- ${col.displayName || col.name} (${getTypeDescription(col.type)})`
            if (col.description) description += `: ${col.description}`
            description += "\n"
        })
    }

    return description
}

/**
 * Gets a user-friendly description of a data type
 */
function getTypeDescription(type: string): string {
    switch (type) {
        case "string":
            return "Text"
        case "number":
            return "Number"
        case "date":
            return "Date (YYYY-MM-DD)"
        case "boolean":
            return "Yes/No"
        case "email":
            return "Email Address"
        case "phone":
            return "Phone Number"
        default:
            return type
    }
}

