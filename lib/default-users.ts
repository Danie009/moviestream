import type { User } from "./types"

export const defaultUsers: Array<User & { password: string }> = [
  {
    id: "admin-1",
    email: "daniel.mwesigwa.ot@gmail.com",
    password: "daniel",
    name: "Daniel Mwesigwa",
    role: "admin",
  },
  // You can add more default admin/moderator users here
  {
    id: "mod-1",
    email: "moderator@example.com",
    password: "moderator123",
    name: "Moderator User",
    role: "moderator",
  },
]
