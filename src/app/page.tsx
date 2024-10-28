import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation";

export default async function App() {
  const {getUser} = await getKindeServerSession();
  const user = await getUser();
  
  if(user) {
    redirect('/dashboard')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" variant="default">
            <LoginLink className="w-full">Sign in</LoginLink>
          </Button>
          <Button className="w-full" variant="outline">
            <RegisterLink className="w-full">Sign up</RegisterLink>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Powered by Kinde Auth
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}