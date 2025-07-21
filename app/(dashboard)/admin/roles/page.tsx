"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Role {
  id: number
  name: string
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editRole, setEditRole] = useState<Role | null>(null)
  const [roleName, setRoleName] = useState("")

  const fetchRoles = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/roles")
    const data = await res.json()
    setRoles(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleAdd = () => {
    setEditRole(null)
    setRoleName("")
    setShowDialog(true)
  }

  const handleEdit = (role: Role) => {
    setEditRole(role)
    setRoleName(role.name)
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this role?")) return
    const res = await fetch(`/api/admin/roles/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Role deleted")
      fetchRoles()
    } else {
      toast.error("Failed to delete role")
    }
  }

  const handleSave = async () => {
    if (!roleName.trim()) return toast.error("Role name required")
    if (editRole) {
      // Update
      const res = await fetch(`/api/admin/roles/${editRole.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName })
      })
      if (res.ok) {
        toast.success("Role updated")
        setShowDialog(false)
        fetchRoles()
      } else {
        toast.error("Failed to update role")
      }
    } else {
      // Create
      const res = await fetch(`/api/admin/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName })
      })
      if (res.ok) {
        toast.success("Role created")
        setShowDialog(false)
        fetchRoles()
      } else {
        toast.error("Failed to create role")
      }
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Manage user roles</p>
        </div>
        <Button onClick={handleAdd}>Add Role</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>List of all roles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map(role => (
                  <TableRow key={role.id}>
                    <TableCell>{role.id}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(role)} className="mr-2">Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(role.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRole ? "Edit Role" : "Add Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Role name"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              required
            />
            <Button onClick={handleSave}>{editRole ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 