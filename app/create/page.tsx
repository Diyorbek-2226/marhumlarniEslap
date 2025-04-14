"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus } from "lucide-react"

export default function CreatePost() {
  return (
    <div className="container max-w-2xl py-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Memorial Post</h1>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter full name" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="years">Years</Label>
            <div className="flex space-x-2">
              <Input id="birth" placeholder="Birth year" />
              <Input id="death" placeholder="Death year" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Share memories about your loved one..."
              rows={5}
            />
          </div>
          
          <Button className="w-full">
            Create Post
          </Button>
        </form>
      </Card>
    </div>
  )
}