"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileDown, FileText, Info, FileSpreadsheet, FileJson, FileCheck } from "lucide-react"
import { exportTemplate, generateSampleData, generateTemplateDescription } from "@/lib/template-utils"
import type { ImporterConfig } from "@/lib/types"

interface TemplateDownloadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    config: ImporterConfig
}

export function TemplateDownloadDialog({ open, onOpenChange, config }: TemplateDownloadDialogProps) {
    const [selectedFormat, setSelectedFormat] = useState<string>("excel")
    const [activeTab, setActiveTab] = useState<string>("preview")
    const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false)

    const sampleData = generateSampleData(config, 3)
    const templateDescription = generateTemplateDescription(config)

    const handleDownload = () => {
        try {
            exportTemplate(config, selectedFormat, "import_template")
            setDownloadSuccess(true)

            // Reset success message after 3 seconds
            setTimeout(() => {
                setDownloadSuccess(false)
            }, 3000)
        } catch (error) {
            console.error("Error downloading template:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <FileDown className="mr-2 h-5 w-5" />
                        Download Data Import Template
                    </DialogTitle>
                    <DialogDescription>
                        Download a template file with sample data to help you format your data correctly
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="preview">
                            <FileText className="mr-2 h-4 w-4" />
                            Data Preview
                        </TabsTrigger>
                        <TabsTrigger value="instructions">
                            <Info className="mr-2 h-4 w-4" />
                            Instructions
                        </TabsTrigger>
                        <TabsTrigger value="download">
                            <FileDown className="mr-2 h-4 w-4" />
                            Download
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="flex-1 overflow-hidden">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Template Preview</h3>
                                <Badge variant="outline">
                                    {config.columns.length} {config.columns.length === 1 ? "column" : "columns"}
                                </Badge>
                            </div>

                            <ScrollArea className="h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {config.columns.map((column, index) => (
                                                <TableHead key={index} className="whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {column.displayName || column.name}
                                                        {column.required && <span className="ml-1 text-red-500">*</span>}
                                                    </div>
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sampleData.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {config.columns.map((column, colIndex) => (
                                                    <TableCell key={colIndex}>
                                                        {row[column.name] !== undefined ? String(row[column.name]) : ""}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>

                            <div className="text-sm text-muted-foreground">
                                <p>* Required fields are marked with an asterisk</p>
                                <p>This preview shows sample data that will be included in your template</p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="instructions" className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-6 pr-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>How to Use This Template</CardTitle>
                                        <CardDescription>Follow these steps to successfully import your data</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ol className="list-decimal pl-5 space-y-3">
                                            <li>
                                                <strong>Download the template</strong> in your preferred format (Excel, CSV, or JSON).
                                            </li>
                                            <li>
                                                <strong>Fill in your data</strong> following the sample format provided. Make sure to:
                                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                                    <li>Keep the column headers exactly as they are</li>
                                                    <li>Fill in all required fields (marked with *)</li>
                                                    <li>Follow the correct data format for each column</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <strong>Save your file</strong> in the same format you downloaded.
                                            </li>
                                            <li>
                                                <strong>Upload your file</strong> using the file uploader in the main interface.
                                            </li>
                                            <li>
                                                <strong>Review and validate</strong> your data before final import.
                                            </li>
                                        </ol>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Field Descriptions</CardTitle>
                                        <CardDescription>Information about each field in the template</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="whitespace-pre-wrap text-sm">{templateDescription}</pre>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tips for Successful Import</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>Ensure dates are in YYYY-MM-DD format (e.g., 2023-12-31)</li>
                                            <li>For boolean/Yes-No fields, use "Yes"/"No", "True"/"False", or "1"/"0"</li>
                                            <li>Don't change the column names or order</li>
                                            <li>Remove any extra columns not in the template</li>
                                            <li>If using Excel, avoid formatting cells as they may not import correctly</li>
                                            <li>For large datasets, consider splitting into multiple files</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="download" className="flex-1 overflow-hidden">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Choose Template Format</CardTitle>
                                    <CardDescription>Select the file format that works best for your needs</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <RadioGroupItem value="excel" id="format-excel" />
                                            <div className="grid gap-1.5 leading-none">
                                                <div className="flex items-center">
                                                    <Label htmlFor="format-excel" className="font-medium flex items-center">
                                                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                                        Excel (.xlsx)
                                                    </Label>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Best for most users. Supports formatting and is compatible with Microsoft Excel and Google
                                                    Sheets.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <RadioGroupItem value="csv" id="format-csv" />
                                            <div className="grid gap-1.5 leading-none">
                                                <div className="flex items-center">
                                                    <Label htmlFor="format-csv" className="font-medium flex items-center">
                                                        <FileText className="mr-2 h-4 w-4 text-blue-600" />
                                                        CSV (.csv)
                                                    </Label>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Simple text format that can be opened in any spreadsheet program or text editor. Best for
                                                    compatibility.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <RadioGroupItem value="json" id="format-json" />
                                            <div className="grid gap-1.5 leading-none">
                                                <div className="flex items-center">
                                                    <Label htmlFor="format-json" className="font-medium flex items-center">
                                                        <FileJson className="mr-2 h-4 w-4 text-amber-600" />
                                                        JSON (.json)
                                                    </Label>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    For technical users or API integration. Preserves data types but requires JSON knowledge.
                                                </p>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {downloadSuccess && (
                                <Alert className="bg-green-50 border-green-200">
                                    <FileCheck className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-800">Download Started</AlertTitle>
                                    <AlertDescription className="text-green-700">
                                        Your template has been downloaded successfully. Check your downloads folder.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex justify-center">
                                <Button size="lg" onClick={handleDownload} className="w-full max-w-md">
                                    <FileDown className="mr-2 h-5 w-5" />
                                    Download Template ({selectedFormat.toUpperCase()})
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

