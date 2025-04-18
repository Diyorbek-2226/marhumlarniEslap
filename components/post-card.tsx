"use client"

import React, { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Share2, Music2, X, Send } from 'lucide-react'
import { Input } from "@/components/ui/input"
import Image from "next/image"
import likeIcon from "../static/images/like.png"
import unlikeIcon from "../static/images/bezlike.png"

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
}

export default function PostCard({ post, isActive }: { post: Post; isActive: boolean }) {
  const [liked, setLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      text: "Alloh rahmat qilsin",
      author: { name: "Abdulloh", avatar: "https://github.com/shadcn.png" },
      createdAt: "2024-03-20",
    },
    {
      id: 2,
      text: "Jannatda bo'lsinlar",
      author: { name: "Muhammadali" },
      createdAt: "2024-03-19",
    },
  ])
const navigate=useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      isActive ? videoRef.current.play().catch(console.log) : videoRef.current.pause()
    }
  }, [isActive])

  // const stompClient = useSocket()
  // useEffect(() => {
  //   if(stompClient && stompClient.connected){
  //     const subscribe = stompClient.subscribe(`/topic/likes/${post.id}`, (message) => {
  //       const data = JSON.parse(message.body)
  //       console.log('wsdata', data);
  //     })
  //     stompClient.publish({
  //       destination: `/topic/likes/${post.id}`
  //     })
  //     return () => {
  //       if (subscribe){
  //         subscribe.unsubscribe();
  //       }
  //     }
  //   }
  // }, [])

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: comments.length + 1,
      text: newComment,
      author: { name: "You" },
      createdAt: new Date().toISOString(),
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()

  return (
    <div className="md:flex md:justify-center">
      <div className="snap-start min-h-[90vh] sm:w-1/3 flex relative bg-black rounded-lg overflow-hidden">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={post.profilePhoto || "/placeholder.svg"}
            alt={post.fullName}
            className="w-full h-full object-contain "
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* Top Info */}
          <div className="flex items-center justify-between text-white">
           
          </div>

          {/* Bottom Info */}
          <div className="text-white space-y-2 pr-20">
            <div className="flex items-center space-x-3">
              <div>
              <p
  onClick={() => {
    const queryParams = new URLSearchParams({
      id: post.id.toString()
    })

    navigate.push(`post/deadinfo?${queryParams.toString()}`)
  }}
  className="text-xl font-bold italic cursor-pointer"
>
  {post.fullName}
</p>
                <p className="text-xs ">{post.birthDate} - {post.deathDate}</p>
              </div>
            </div>
            <p className="text-sm mt-2">{post.definition}</p>
          </div>

          {/* Action Buttons */}
          <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-gray-500 backdrop-blur-sm">
                <Image
                  onClick={handleLike}
                  src={liked ? likeIcon : unlikeIcon}
                  alt="Like"
                  className="w-[80%] rounded-full cursor-pointer"
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
        </div>
      </div>

      {/* Comments Modal - Floating on Right */}
      {isCommentsOpen && (
        <div className="fixed top-0 right-0 z-10 bg-opacity-80 backdrop-blur-sm p-4 overflow-y-auto w-1/3 h-full">
          <div className="flex justify-between items-center text-white mb-4">
            <h3 className="text-lg font-semibold">Izohlar</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsCommentsOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </Button>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{comment.author.name}</p>
                  <p className="text-sm text-white/80">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitComment} className="mt-4 flex items-center space-x-2">
            <Input
              className="flex-1"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Izoh yozing..."
            />
            <Button type="submit" variant="ghost" size="icon" className="text-white">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
