"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { TemplateDownloadDialog } from "./template-download-dialog"
import type { ImporterConfig } from "@/lib/types"

interface TemplateDownloadButtonProps {
    config: ImporterConfig
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
}

export function TemplateDownloadButton({ config, variant = "outline", size = "default" }: TemplateDownloadButtonProps) {
    const [showDialog, setShowDialog] = useState(false)

    return (
        <>
            <Button variant={variant} size={size} onClick={() => setShowDialog(true)}>
                <FileDown className="mr-2 h-4 w-4" />
                Download Template
            </Button>

            <TemplateDownloadDialog open={showDialog} onOpenChange={setShowDialog} config={config} />
        </>
    )
}

