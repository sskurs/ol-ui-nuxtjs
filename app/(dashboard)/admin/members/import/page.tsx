"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileSpreadsheet,
} from "lucide-react"
import { toast } from "sonner"

interface ImportMember {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  initialPoints: number
  notes?: string
  rowNumber: number
  errors: string[]
  isValid: boolean
}

interface ImportSettings {
  defaultTier: "bronze" | "silver" | "gold" | "platinum"
  defaultPoints: number
  sendWelcomeEmails: boolean
  skipDuplicates: boolean
  updateExisting: boolean
}

type ImportStep = "upload" | "preview" | "importing" | "results"

export default function ImportMembersPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentStep, setCurrentStep] = useState<ImportStep>("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importData, setImportData] = useState<ImportMember[]>([])
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    defaultTier: "bronze",
    defaultPoints: 0,
    sendWelcomeEmails: true,
    skipDuplicates: true,
    updateExisting: false,
  })
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: [] as string[],
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      toast.error("Please select a CSV or Excel file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setSelectedFile(file)
    toast.success("File selected successfully")
  }

  const parseCSVFile = (content: string): ImportMember[] => {
    const lines = content.split("\n").filter((line) => line.trim())
    if (lines.length < 2) {
      throw new Error("File must contain at least a header row and one data row")
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const requiredHeaders = ["firstname", "lastname", "email", "phone"]

    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
    }

    const members: ImportMember[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
      const member: ImportMember = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        tier: importSettings.defaultTier,
        initialPoints: importSettings.defaultPoints,
        rowNumber: i + 1,
        errors: [],
        isValid: true,
      }

      // Map values to member properties
      headers.forEach((header, index) => {
        const value = values[index] || ""
        switch (header) {
          case "firstname":
            member.firstName = value
            break
          case "lastname":
            member.lastName = value
            break
          case "email":
            member.email = value
            break
          case "phone":
            member.phone = value
            break
          case "dateofbirth":
            member.dateOfBirth = value
            break
          case "address":
            member.address = value
            break
          case "city":
            member.city = value
            break
          case "state":
            member.state = value
            break
          case "zipcode":
            member.zipCode = value
            break
          case "tier":
            if (["bronze", "silver", "gold", "platinum"].includes(value.toLowerCase())) {
              member.tier = value.toLowerCase() as any
            }
            break
          case "points":
            const points = Number.parseInt(value)
            if (!isNaN(points) && points >= 0) {
              member.initialPoints = points
            }
            break
          case "notes":
            member.notes = value
            break
        }
      })

      // Validate member data
      if (!member.firstName.trim()) {
        member.errors.push("First name is required")
      }
      if (!member.lastName.trim()) {
        member.errors.push("Last name is required")
      }
      if (!member.email.trim()) {
        member.errors.push("Email is required")
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        member.errors.push("Invalid email format")
      }
      if (!member.phone.trim()) {
        member.errors.push("Phone number is required")
      }

      member.isValid = member.errors.length === 0
      members.push(member)
    }

    return members
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first")
      return
    }

    try {
      const content = await selectedFile.text()
      const members = parseCSVFile(content)

      setImportData(members)
      setCurrentStep("preview")
      toast.success(`Parsed ${members.length} members from file`)
    } catch (error) {
      console.error("Error parsing file:", error)
      toast.error(error instanceof Error ? error.message : "Failed to parse file")
    }
  }

  const handleImport = async () => {
    const validMembers = importData.filter((m) => m.isValid)
    if (validMembers.length === 0) {
      toast.error("No valid members to import")
      return
    }

    setCurrentStep("importing")
    setImportProgress(0)

    const results = {
      total: validMembers.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    }

    // Simulate import process
    for (let i = 0; i < validMembers.length; i++) {
      const member = validMembers[i]

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Simulate some failures for demo
        if (Math.random() < 0.1) {
          throw new Error("Duplicate email address")
        }

        // Generate member data
        const newMember = {
          id: `MEM${Date.now()}_${i}`,
          name: `${member.firstName} ${member.lastName}`,
          email: member.email,
          phone: member.phone,
          tier: member.tier,
          points: member.initialPoints,
          cardNumber: `LC${Math.random().toString().slice(2, 14)}`,
          status: "active",
          joinDate: new Date().toISOString().split("T")[0],
          createdBy: "admin_import",
        }

        console.log("Imported member:", newMember)
        results.successful++
      } catch (error) {
        results.failed++
        results.errors.push(`Row ${member.rowNumber}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }

      setImportProgress(((i + 1) / validMembers.length) * 100)
    }

    setImportResults(results)
    setCurrentStep("results")

    if (results.successful > 0) {
      toast.success(`Successfully imported ${results.successful} members`)
    }
    if (results.failed > 0) {
      toast.error(`Failed to import ${results.failed} members`)
    }
  }

  const downloadTemplate = () => {
    const template = `firstName,lastName,email,phone,dateOfBirth,address,city,state,zipCode,tier,points,notes
John,Doe,john.doe@example.com,+1234567890,1990-01-15,123 Main St,New York,NY,10001,bronze,100,VIP customer
Jane,Smith,jane.smith@example.com,+1987654321,1985-05-20,456 Oak Ave,Los Angeles,CA,90210,silver,250,Referred by friend`

    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "member_import_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Template downloaded successfully")
  }

  const validMembers = importData.filter((m) => m.isValid)
  const invalidMembers = importData.filter((m) => !m.isValid)

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/members")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Members
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Import Members</h1>
              <p className="text-muted-foreground">Bulk import members from CSV or Excel files</p>
            </div>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4">
          {[
            { step: "upload", label: "Upload File", icon: Upload },
            { step: "preview", label: "Preview Data", icon: FileText },
            { step: "importing", label: "Importing", icon: Users },
            { step: "results", label: "Results", icon: CheckCircle },
          ].map(({ step, label, icon: Icon }, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  currentStep === step
                    ? "bg-primary text-primary-foreground"
                    : index < ["upload", "preview", "importing", "results"].indexOf(currentStep)
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              {index < 3 && <div className="w-8 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        {/* Upload Step */}
        {currentStep === "upload" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>
                  Select a CSV or Excel file containing member data. Maximum file size is 10MB.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      {selectedFile ? selectedFile.name : "Choose a file to upload"}
                    </p>
                    <p className="text-sm text-muted-foreground">Supported formats: CSV, XLS, XLSX</p>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Select File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button onClick={handleFileUpload}>Parse File</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Import Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Import Settings</CardTitle>
                <CardDescription>Configure default values and import behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Tier</Label>
                    <Select
                      value={importSettings.defaultTier}
                      onValueChange={(value: any) => setImportSettings((prev) => ({ ...prev, defaultTier: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Default Points</Label>
                    <Input
                      type="number"
                      min="0"
                      value={importSettings.defaultPoints}
                      onChange={(e) =>
                        setImportSettings((prev) => ({
                          ...prev,
                          defaultPoints: Number.parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send Welcome Emails</Label>
                      <p className="text-sm text-muted-foreground">Send welcome emails to all imported members</p>
                    </div>
                    <Switch
                      checked={importSettings.sendWelcomeEmails}
                      onCheckedChange={(checked) =>
                        setImportSettings((prev) => ({
                          ...prev,
                          sendWelcomeEmails: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Skip Duplicates</Label>
                      <p className="text-sm text-muted-foreground">Skip members with existing email addresses</p>
                    </div>
                    <Switch
                      checked={importSettings.skipDuplicates}
                      onCheckedChange={(checked) =>
                        setImportSettings((prev) => ({
                          ...prev,
                          skipDuplicates: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Update Existing</Label>
                      <p className="text-sm text-muted-foreground">Update existing members instead of skipping</p>
                    </div>
                    <Switch
                      checked={importSettings.updateExisting}
                      onCheckedChange={(checked) =>
                        setImportSettings((prev) => ({
                          ...prev,
                          updateExisting: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Format Help */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Required columns:</strong> firstName, lastName, email, phone
                <br />
                <strong>Optional columns:</strong> dateOfBirth, address, city, state, zipCode, tier, points, notes
                <br />
                Download the template above for the correct format.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Preview Step */}
        {currentStep === "preview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{importData.length}</p>
                      <p className="text-sm text-muted-foreground">Total Records</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{validMembers.length}</p>
                      <p className="text-sm text-muted-foreground">Valid Records</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">{invalidMembers.length}</p>
                      <p className="text-sm text-muted-foreground">Invalid Records</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {invalidMembers.length > 0 && (
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {invalidMembers.length} records have validation errors and will be skipped during import. Please
                  review and fix the errors below.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>Review the data before importing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">Row</th>
                        <th className="border border-border p-2 text-left">Status</th>
                        <th className="border border-border p-2 text-left">Name</th>
                        <th className="border border-border p-2 text-left">Email</th>
                        <th className="border border-border p-2 text-left">Phone</th>
                        <th className="border border-border p-2 text-left">Tier</th>
                        <th className="border border-border p-2 text-left">Points</th>
                        <th className="border border-border p-2 text-left">Errors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importData.slice(0, 10).map((member, index) => (
                        <tr key={index} className={member.isValid ? "" : "bg-red-50"}>
                          <td className="border border-border p-2">{member.rowNumber}</td>
                          <td className="border border-border p-2">
                            {member.isValid ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Valid
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Invalid</Badge>
                            )}
                          </td>
                          <td className="border border-border p-2">
                            {member.firstName} {member.lastName}
                          </td>
                          <td className="border border-border p-2">{member.email}</td>
                          <td className="border border-border p-2">{member.phone}</td>
                          <td className="border border-border p-2 capitalize">{member.tier}</td>
                          <td className="border border-border p-2">{member.initialPoints}</td>
                          <td className="border border-border p-2">
                            {member.errors.length > 0 && (
                              <div className="text-sm text-red-600">{member.errors.join(", ")}</div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importData.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing first 10 records. {importData.length - 10} more records will be processed.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                Back to Upload
              </Button>
              <Button onClick={handleImport} disabled={validMembers.length === 0}>
                Import {validMembers.length} Members
              </Button>
            </div>
          </div>
        )}

        {/* Importing Step */}
        {currentStep === "importing" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Importing Members</CardTitle>
                <CardDescription>Please wait while we import your members...</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <div>
                    <p className="text-lg font-medium">Importing members...</p>
                    <p className="text-sm text-muted-foreground">{Math.round(importProgress)}% complete</p>
                  </div>
                </div>
                <Progress value={importProgress} className="w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Step */}
        {currentStep === "results" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{importResults.total}</p>
                      <p className="text-sm text-muted-foreground">Total Processed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{importResults.successful}</p>
                      <p className="text-sm text-muted-foreground">Successful</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">{importResults.failed}</p>
                      <p className="text-sm text-muted-foreground">Failed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{importResults.skipped}</p>
                      <p className="text-sm text-muted-foreground">Skipped</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {importResults.errors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Errors</CardTitle>
                  <CardDescription>The following errors occurred during import</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {importResults.errors.map((error, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.push("/admin/members")}>
                View Members
              </Button>
              <Button
                onClick={() => {
                  setCurrentStep("upload")
                  setSelectedFile(null)
                  setImportData([])
                  setImportProgress(0)
                  setImportResults({ total: 0, successful: 0, failed: 0, skipped: 0, errors: [] })
                }}
              >
                Import More Members
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
