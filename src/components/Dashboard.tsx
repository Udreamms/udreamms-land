/**
 * v0 by Vercel.
 * @see https://v0.dev/t/L3aJkI3yGJA
 * Documentation: https://v0.dev/docs#integrating-with-your-app
 */
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { learnItems } from "@/lib/dashboard-data"; // Import the data

export function Dashboard() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent>
              <h3 className="text-lg font-bold">What's new</h3>
              <ul className="space-y-2">
                <li>Feature one is now available.</li>
                <li>We've updated our privacy policy.</li>
                <li>Check out the new dashboard layout.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-lg font-bold">Getting started</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#">How to create your first project</Link>
                </li>
                <li>
                  <Link href="#">Understanding our billing system</Link>
                </li>
                <li>
                  <Link href="#">Inviting team members</Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-lg font-bold">Templates</h3>
              <p>Start with a template. You can always customize it later.</p>
              <Button size="sm">Browse templates</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-lg font-bold">Community</h3>
              <p>Ask questions and get help from our community.</p>
              <Button size="sm">Join community</Button>
            </CardContent>
          </Card>
        </div>
        <div>
          <h3 className="text-lg font-bold">Learn</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {learnItems.map((item, index) => (
              <Card key={index}>
                <img
                  alt={item.title}
                  className="w-full h-32 object-cover"
                  height="150"
                  src={item.image}
                  style={{
                    aspectRatio: "300/150",
                    objectFit: "cover",
                  }}
                  width="300"
                />
                <CardContent>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold">Projects</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent>
                <h4>Project Alpha</h4>
                <p>Due in 5 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h4>Project Beta</h4>
                <p>Due in 2 weeks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h4>Project Gamma</h4>
                <p>Due in 1 month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
