"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

// Define the Post interface
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
  birthAddress?: string | null
  cemetery?: string | null
  graveNumber?: string | null
  latitude?: string | null
  longitude?: string | null
  qrCodePhoto?: string | null
  createdAt?: string
  createdBy?: {
    id: string
    fullName: string
    email: string
    roles: string[]
    photo: string | null
  }
  accessType?: string
}

// PostCard component embedded in the same file
function PostCard({ post }: { post: Post }) {
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
            <AvatarImage src={post.profilePhoto} alt={post.fullName} />
            <AvatarFallback>{getInitials(post.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{post.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.birthDate)} - {formatDate(post.deathDate)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={post.profilePhoto || "/placeholder.svg?height=400&width=400"}
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
          {post.commentsCount > 0 && (
            <button className="text-muted-foreground text-sm mt-1">View all {post.commentsCount} comments</button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main PostsPage component
export default function PostsPage() {
  const { ref, inView } = useInView()
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 3,
      fullName: "fvdfv",
      profilePhoto: "https://s3.tenzorsoft.uz/s3-tenzorsoft/402ec5c5-60bc-402a-a7ce-d58f585618c6.jpg",
      birthDate: "01.01.2000",
      deathDate: "03.04.2012",
      definition: "u yaxshi inson edi",
      likeCount: 1,
      commentsCount: 3,
      isLiked: false,
      shareLink: "https://yodimdasiz.uz/link/ec97814a-acbc-4daf-b654-780a3346ba4f",
    },
    {
      id: 2,
      fullName: "Test post",
      profilePhoto: "https://s3.tenzorsoft.uz/s3-tenzorsoft/abb2dcec-481c-4e48-9ce1-1bb95c64d6d3.jpg",
      birthDate: "01.04.2025",
      deathDate: "03.04.2025",
      definition: "Test description",
      likeCount: 5,
      commentsCount: 2,
      isLiked: true,
      shareLink: "https://yodimdasiz.uz/link/test",
    },
    {
      id: 1,
      fullName: "Alisher Navoiy",
      profilePhoto: "https://s3.tenzorsoft.uz/s3-tenzorsoft/9129a5b2-26a9-4373-b100-7e8b5925c5d0.jpg",
      birthDate: "09.02.1441",
      deathDate: "03.01.1501",
      definition: "Buyuk o'zbek shoiri va mutafakkiri",
      likeCount: 120,
      commentsCount: 15,
      isLiked: false,
      shareLink: "https://yodimdasiz.uz/link/alisher-navoiy",
    },
  ])

  // Uncomment this section if you want to use API data instead of static data
  /*
  const { data, isError, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await fetch(`/api/posts/all?page=${pageParam}&size=10`).then(res => res.json())
      return data
    },
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  })

  // Use API data if available
  const apiPosts = data?.data?.content || []
  const displayPosts = apiPosts.length > 0 ? apiPosts : posts
  */

  // For now, just use the static posts
  const displayPosts = posts

  return (
    <div className="container p-2 sm:w-4/5 sm:mx-auto py-4">
      

      <div className="max-w-md ">
        {displayPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={ref} className="mt-8 flex justify-center">
        {/* {isLoading && <Loader2 className="h-6 w-6 animate-spin" />} */}
      </div>
    </div>
  )
}
