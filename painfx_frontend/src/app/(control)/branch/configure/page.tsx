import { Badge } from '@/components/ui/badge'
import { ConfigCard } from '@/features/control/components/config-card'

export default function ConfigurePage() {
  return (
        <main className="flex-1 p-6 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Email, phone, username
            </h1>
            <p className="text-muted-foreground">
              Configure the user attributes the Clerk API should work with
            </p>
          </div>

          <div className="space-y-6">
            <ConfigCard
              title="Contact information"
              description="Specify whether your users should have email addresses or phone numbers"
              features={[
                {
                  title: "Email address",
                  description: "Users can add email addresses to their account",
                  enabled: true,
                  options: (
                    <div className="flex gap-4 mt-2">
                      <Badge variant="outline">Required</Badge>
                      <Badge variant="outline">Used for sign-in</Badge>
                      <Badge variant="outline">Verify at sign-up</Badge>
                    </div>
                  ),
                },
                {
                  title: "Phone number",
                  description: "Users can add phone numbers to their account",
                  enabled: false,
                  pro: true,
                },
              ]}
            />

            <ConfigCard
              title="Username"
              description="Specify whether your users have a unique username"
              features={[
                {
                  title: "Username",
                  description: "Users can set usernames to their account",
                  enabled: false,
                },
              ]}
            />

            <ConfigCard
              title="Authentication strategies"
              description="Select the authentication methods to present when a user signs in"
              features={[
                {
                  title: "Password",
                  description: "Users can sign in with a password. Passwords are required during sign up unless the user signs up with a social connection or a Web3 wallet.",
                  enabled: true,
                  options: (
                    <div className="flex gap-4 mt-2">
                      <Badge variant="outline">8+ characters</Badge>
                      <Badge variant="outline">Reject compromised on sign-up</Badge>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </main>
  )
}

