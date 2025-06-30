import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Filter,
  Download,
} from "lucide-react";

// Mock users data
const usersData = [
  {
    id: 1,
    username: "john_doe",
    email: "john.doe@example.com",
    roles: ["Admin", "Manager"],
    status: "Active",
    lastLogin: "2024-01-15 10:30",
    createdAt: "2023-06-15",
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane.smith@example.com",
    roles: ["Editor"],
    status: "Active",
    lastLogin: "2024-01-14 16:45",
    createdAt: "2023-08-22",
  },
  {
    id: 3,
    username: "bob_wilson",
    email: "bob.wilson@example.com",
    roles: ["Viewer"],
    status: "Inactive",
    lastLogin: "2024-01-10 09:15",
    createdAt: "2023-09-10",
  },
  {
    id: 4,
    username: "alice_brown",
    email: "alice.brown@example.com",
    roles: ["Manager", "Editor"],
    status: "Active",
    lastLogin: "2024-01-15 14:20",
    createdAt: "2023-07-05",
  },
  {
    id: 5,
    username: "charlie_davis",
    email: "charlie.davis@example.com",
    roles: ["Guest"],
    status: "Pending",
    lastLogin: "Never",
    createdAt: "2024-01-14",
  },
  {
    id: 6,
    username: "diana_miller",
    email: "diana.miller@example.com",
    roles: ["Editor", "Viewer"],
    status: "Active",
    lastLogin: "2024-01-15 11:30",
    createdAt: "2023-11-20",
  },
  {
    id: 7,
    username: "frank_garcia",
    email: "frank.garcia@example.com",
    roles: ["Admin"],
    status: "Active",
    lastLogin: "2024-01-15 08:45",
    createdAt: "2023-05-12",
  },
  {
    id: 8,
    username: "grace_lee",
    email: "grace.lee@example.com",
    roles: ["Manager"],
    status: "Active",
    lastLogin: "2024-01-14 13:10",
    createdAt: "2023-10-08",
  },
];

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState(usersData);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roles.some((role) =>
        role.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Manager":
        return "bg-orange-100 text-orange-800";
      case "Editor":
        return "bg-blue-100 text-blue-800";
      case "Viewer":
        return "bg-green-100 text-green-800";
      case "Guest":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and roles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all users in the system ({filteredUsers.length}{" "}
            users)
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role} className={getRoleColor(role)}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuItem>Manage roles</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
