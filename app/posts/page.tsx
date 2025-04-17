"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Send, Music2, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useInView } from "react-intersection-observer"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
import like from '../../static/images/like.png'
import bezlike from '../../static/images/bezlike.png'
import Image from "next/image"
import { io } from "socket.io-client"
import { useRouter } from "next/navigation"
interface Comment {
  id: number
  text: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
}

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



function PostCard({ post, isActive }: { post: Post; isActive: boolean }) {
  const [liked, setLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [likes, Setlikes]=useState(false)
  const socet=useRef<ReturnType<typeof io>>(null)
  const navigate=useRouter()
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      text: "Alloh rahmat qilsin",
      author: {
        name: "Abdulloh",
        avatar: "https://github.com/shadcn.png",
      },
      createdAt: "2024-03-20",
    },
    {
      id: 2,
      text: "Jannatda bo'lsinlar",
      author: {
        name: "Muhammadali",
      },
      createdAt: "2024-03-19",
    },
  ])
  
  // Pause video when not in view
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e))
      } else {
        videoRef.current.pause()
      }
    }
  }, [isActive])

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1)
      Setlikes(false)
    } else {
      setLikeCount((prev) => prev + 1)
      Setlikes(true)
    }
    setLiked(!liked)
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: comments.length + 1,
      text: newComment,
      author: {
        name: "You",
      },
      createdAt: new Date().toISOString(),
    }

    setComments([...comments, comment])
    setNewComment("")
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
  
  
  useEffect(() => {
    // socet.current = io('ws://api.yodimdasiz.uz/ws')
  
    return () => {
      // socet.current?.disconnect() // komponent unmount bo‘lsa soketni tozalash
    }
  }, [])

  return (
   <div className=" md:flex md:justify-center ">
     <div className="snap-start min-h-[90vh]  sm:w-1/3 flex relative bg-black">
      {/* Main content */}
      <div className="absolute inset-0">
        <img
          src={post.profilePhoto || "/placeholder.svg?height=400&width=400"}
          alt={post.fullName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* Top section */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Music2 className="h-5 w-5" />
            <span className="text-sm font-medium">Yodimdasiz</span>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-gray-500   backdrop-blur-sm "
              
            >
              <Image  onClick={handleLike}
  src={likes? like:bezlike} 
  alt="Like icon" 
  className="w-[80%] rounded-[50%]"
/>
            
            </Button>
            <span className="text-white text-xs mt-1">{likeCount}</span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={() => setIsCommentsOpen(true)}
            >
              <MessageCircle className="h-7 w-7 text-white" />
            </Button>
            <span className="text-white text-xs mt-1">{comments.length}</span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
            >
              <Share2 className="h-7 w-7 text-white" />
            </Button>
            <span className="text-white text-xs mt-1">Share</span>
          </div>
        </div>

        {/* Bottom section */}
        <div className="text-white space-y-2 pr-20">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={post.profilePhoto || "/placeholder.svg"} alt={post.fullName} />
              <AvatarFallback>{getInitials(post.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{post.fullName}</p>
              <p className="text-sm opacity-90">
                {formatDate(post.birthDate)} - {formatDate(post.deathDate)}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{post.definition}</p>
        </div>
      </div>

      {/* Comments panel - slides in from right */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 bg-background shadow-xl transition-transform duration-300 ease-in-out z-50",
          "w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]",
          isCommentsOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsCommentsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 bg-muted/30 p-3 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Send className="h-5 w-5" />
              <span className="sr-only">Send comment</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
   </div>
  )
}

export default function PostsPage() {
  const [activeIndex, setActiveIndex] = useState()

  const containerRef = useRef<HTMLDivElement>(null)
  
  // For loading more content when reaching the end
  const { ref: loadMoreRef, inView: isLoadMoreVisible } = useInView({
    threshold: 0.5,
  })
  
  // For detecting which post is currently in view
  const postRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {

      const res = await api.get(`/posts/all?page=${pageParam}&size=20`)
      return res.data?.data
      console.log(res.data);
      
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.last) return undefined
      return (lastPage?.number || 0) + 1
       
    },
    initialPageParam: 0,
  })
  
  
  // Flatten the pages data into a single array of posts
  const posts = data?.pages.flatMap(page => page?.content || []) || []
  
  // Load more posts when reaching the end
  useEffect(() => {
    if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
     
    }
  }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage])
  
  // Handle scroll events to determine active post
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const container = containerRef.current
      const scrollTop = container.scrollTop
      const viewportHeight = container.clientHeight
      
      // Find which post is most visible in the viewport
      let maxVisibleIndex = 0
      let maxVisibleArea = 0
      
      postRefs.current.forEach((ref, index) => {
        if (!ref) return
        
        const rect = ref.getBoundingClientRect()
        const postTop = rect.top
        const postHeight = rect.height
        
        // Calculate how much of the post is visible
        const visibleTop = Math.max(0, postTop)
        const visibleBottom = Math.min(viewportHeight, postTop + postHeight)
        const visibleArea = Math.max(0, visibleBottom - visibleTop)
        
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea
          maxVisibleIndex = index
        }
      })
      
      setActiveIndex(maxVisibleIndex)
    }
    
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [posts.length])
  
  // Navigation functions
  const scrollToPost = (index: number) => {
    if (index < 0 || index >= posts.length || !containerRef.current) return
    
    const targetPost = postRefs.current[index]
    if (targetPost) {
      containerRef.current.scrollTo({
        top: targetPost.offsetTop,
        behavior: 'smooth'
      })
    }
  }
  
  const goToPrevPost = () => {
    if (activeIndex > 0) {
      scrollToPost(activeIndex - 1)
    }
  }
  
  const goToNextPost = () => {
    if (activeIndex < posts.length - 1) {
      scrollToPost(activeIndex + 1)
      
    }
  }
  
  // Update refs array when posts change
  useEffect(() => {
    postRefs.current = postRefs.current.slice(0, posts.length)
  }, [posts.length])

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Qandaydir xatolik bor
      </div>
    )
  }

  return (
    <div className="relative h-[100dvh] ">
      {/* Main scrollable container */}
      <div 
        ref={containerRef}
        className="snap-y snap-mandatory h-full overflow-y-auto scrollbar-hide"
      >
        {posts.map((post: Post, index: number) => (
          <div 
            key={post.id} 
            ref={el => postRefs.current[index] = el}
            className="snap-start h-[100vh] w-full"
          >
            <PostCard post={post} isActive={index === activeIndex} />
          </div>
        ))}
        
        {/* Load more trigger */}
        {hasNextPage && (
          <div 
            ref={loadMoreRef} 
            className="h-20 flex items-center justify-center"
          >
            {isFetchingNextPage ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <span className="text-white text-sm">Scroll for more</span>
            )}
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10">
        {/* <Button 
          variant="ghost" 
          size="icon" 
          className="sm: h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
          onClick={goToPrevPost}
          disabled={activeIndex === 0}
        >
          <ChevronUp className="h-6 w-6" />
        </Button> */}
        {/* <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
          onClick={goToNextPost}
          disabled={activeIndex === posts.length - 1}
        >
          <ChevronDown className="h-6 w-6" />
        </Button> */}
      </div>
      
      {/* Progress indicator */}
      <div className="absolute right-4 top-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
        {activeIndex + 1} / {posts.length}
      </div>
    </div>
  )
}
