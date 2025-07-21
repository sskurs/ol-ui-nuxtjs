"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { adminAPI } from "@/lib/api"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Merchant {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: string
  createdAt: string
}

export default function MerchantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)

  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-merchants", currentPage, pageSize, searchTerm],
    queryFn: () => adminAPI.getMerchants(currentPage, pageSize, searchTerm),
  })
  const merchants = data?.merchants || []

  const addMerchantMutation = useMutation({
    mutationFn: (data: Partial<Merchant>) => adminAPI.createMerchant(data),
    onSuccess: () => {
      toast.success("Merchant added successfully")
      setAddDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["admin-merchants"] })
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to add merchant")
    },
  })

  const updateMerchantMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Merchant> }) => adminAPI.updateMerchant(id, data),
    onSuccess: () => {
      toast.success("Merchant updated successfully")
      setEditDialogOpen(false)
      setEditingMerchant(null)
      queryClient.invalidateQueries({ queryKey: ["admin-merchants"] })
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to update merchant")
    },
  })

  const deleteMerchantMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteMerchant(id),
    onSuccess: () => {
      toast.success("Merchant deleted successfully")
      setEditDialogOpen(false)
      setEditingMerchant(null)
      queryClient.invalidateQueries({ queryKey: ["admin-merchants"] })
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to delete merchant")
    },
  })

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Merchant Management</h1>
            <p className="text-muted-foreground">Manage and monitor merchants</p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Merchant
          </Button>
        </div>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div className="text-red-600">Failed to load merchants</div>
            ) : merchants.length === 0 ? (
              <div className="text-muted-foreground">No merchants found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Phone</th>
                      <th className="text-left p-2">Address</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchants.map((merchant: Merchant) => (
                      <tr key={merchant.id} className="border-b">
                        <td className="p-2 font-medium">{merchant.name}</td>
                        <td className="p-2">{merchant.email}</td>
                        <td className="p-2">{merchant.phone}</td>
                        <td className="p-2">{merchant.address}</td>
                        <td className="p-2 capitalize">{merchant.status}</td>
                        <td className="p-2 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingMerchant(merchant)
                              setEditDialogOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${merchant.name}?`)) {
                                deleteMerchantMutation.mutate(merchant.id)
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Merchant Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Merchant</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const formData = Object.fromEntries(new FormData(form))
                addMerchantMutation.mutate(formData as any)
              }}
              className="space-y-4"
            >
              <Input name="name" placeholder="Name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" placeholder="Phone" required />
              <Input name="address" placeholder="Address" required />
              <select name="status" className="w-full border rounded p-2" required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMerchantMutation.isPending}>
                  {addMerchantMutation.isPending ? "Adding..." : "Add Merchant"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Merchant Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Merchant</DialogTitle>
            </DialogHeader>
            {editingMerchant && (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  const form = e.target as HTMLFormElement
                  const formData = Object.fromEntries(new FormData(form))
                  updateMerchantMutation.mutate({ id: editingMerchant.id, data: formData as any })
                }}
                className="space-y-4"
              >
                <Input name="name" placeholder="Name" defaultValue={editingMerchant.name} required />
                <Input name="email" type="email" placeholder="Email" defaultValue={editingMerchant.email} required />
                <Input name="phone" placeholder="Phone" defaultValue={editingMerchant.phone} required />
                <Input name="address" placeholder="Address" defaultValue={editingMerchant.address} required />
                <select name="status" className="w-full border rounded p-2" defaultValue={editingMerchant.status} required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMerchantMutation.isPending}>
                    {updateMerchantMutation.isPending ? "Updating..." : "Update Merchant"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
} 