"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import Image from "next/image"

interface Post {
  id: number
  fullName: string
  profilePhoto: string
  birthDate: string
  deathDate: string
  definition: string
  likeCount: number
  commentsCount: number
  isLiked: boolean
  shareLink: string
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likeCount)

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setLiked(!liked)
  }

  const formatDate = (dateString: string) => {
    const parts = dateString.split(".")
    if (parts.length === 3) {
      return `${parts[0]}.${parts[1]}.${parts[2]}`
    }
    return dateString
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="max-w-md mx-auto mb-6 border rounded-lg overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border">
            {/* <AvatarImage src={post.profilePhoto} alt={post.fullName} /> */}
            {/* <AvatarFallback>{getInitials(post.fullName)}</AvatarFallback> */}
          </Avatar>
          <div>
            {/* <p className="font-medium text-sm">{post.fullName}</p> */}
            <p className="text-xs text-muted-foreground">
              {/* {formatDate(post.birthDate)} - {formatDate(post.deathDate)} */}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <Image
            src={post.profilePhoto || "/placeholder.svg"}
            alt={post.fullName}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0" onClick={handleLike}>
              <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Like</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0">
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Comment</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0">
              <Share2 className="h-6 w-6" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
          <div className="text-sm font-medium">{likeCount} likes</div>
          <div className="mt-2">
            <span className="font-medium text-sm">{post.fullName}</span>{" "}
            <span className="text-sm">{post.definition}</span>
          </div>
          {/* {post.commentsCount > 0 && (
            <button className="text-muted-foreground text-sm mt-1">View all {post.commentsCount} comments</button>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
}
