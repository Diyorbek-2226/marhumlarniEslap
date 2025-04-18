'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import PostCard from '@/components/post-card'

interface Post {
  id: string
  title: string
  // Qo'shimcha maydonlar...
}

const PostFilters = () => {
  const searchParams = useSearchParams()
  const viloyat = searchParams.get('viloyat')
  const tuman = searchParams.get('tuman')

  console.log("viloyat:", viloyat, "tuman:", tuman)

  const {
    data: Searchpost = [],
    isError,
    isLoading
  } = useQuery({
    queryKey: ['SearchFilters', viloyat, tuman],
    queryFn: async () => {
      const res = await api.get(`posts/all?region=${viloyat}&district=${tuman}&page=0&size=10`)
      return res.data?.data?.content || []
    },
    enabled: !!viloyat && !!tuman // 🔥 Hook faqat viloyat va tuman bo‘lsa ishga tushadi
  })

  if (isLoading) return <div>Yuklanmoqda...</div>
  if (isError) return <div>Xatolik yuz berdi.</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {Searchpost.length > 0 ? (
        Searchpost.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div>Natijalar topilmadi</div>
      )}
    </div>
  )
}

export default PostFilters
