import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { redirect } from 'next/navigation'
import { Mail, User } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default async function ProfilePage() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        redirect('/');
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-center">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.picture || ''} alt={user?.given_name || 'User'} />
                            <AvatarFallback>{user?.given_name?.[0] || user?.family_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <Label>Email</Label>
                        <Input defaultValue={user?.email || 'Email not provided'} disabled className='text-muted-foreground' />
                    </div>
                    <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-primary" />
                        <Label>First Name</Label>
                        <Input defaultValue={user?.given_name || 'First name not provided'} disabled className='text-muted-foreground' />
                    </div>
                    <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-primary" />
                        <Label>Last Name</Label>
                        <Input defaultValue={user?.family_name || 'Last name not provided'} disabled className='text-muted-foreground' />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}