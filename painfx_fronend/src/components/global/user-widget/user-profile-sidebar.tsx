import { Copy, Eye, ShieldBan, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns';
type UserProfileSidebarProps = {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    joined?: string;
    last_login?: string;
  };
  
  export default function UserProfileSidebar({
    id,
    name,
    avatar,
    joined = "2024-12-02",
    last_login = "2024-12-02",
  }: UserProfileSidebarProps) {
  return (
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage alt={name} src={avatar} />
                <AvatarFallback className="bg-purple-500 text-lg">{name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-xl font-semibold">{name}</h1>
                <p className="text-sm text-muted-foreground">Last signed in {format(new Date(last_login), 'MMM d, yyyy')} ago</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                <span className="text-muted-foreground">User ID:</span>
                <code className="flex-1 text-xs">{id}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Eye className="h-4 w-4" />
                  Add Patient to favourites Patient
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-red-600">
                  <ShieldBan className="h-4 w-4" />
                  Ban Patient
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete Reservations
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
            joined in {format(new Date(joined), 'MMM d, yyyy')} ago
            </div>
          </div>
  )
}

