'use client'
import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface Post {
  id: number;
  fullName: string;
  birthDate: string;
  deathDate: string;
  definition: string;
  profilePhoto: string;
  likeCount: number;
  commentCount: number;
  shareLink: string;
  isliked: boolean;
  createdAt: string;
  createdBy: {
    fullName: string;
    email: string;
  };
}

interface PostResponse {
  content: Post[];
  total: number;
  page: number;
  size: number;
}

const Page: React.FC = () => {
  const {
    isError,
    isLoading,
    data: myPosts,
    error,
  } = useQuery<PostResponse>({
    queryKey: ['mypost'],
    queryFn: async () => {
      const res = await api.get('/posts/my?page=0&size=10');
      return res.data.data;
    },
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (isError) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Xatolik!</strong>
      <span className="block sm:inline"> {(error as Error).message}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mening Postlarim</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myPosts?.content?.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Katta to'rtburchak rasm */}
            <div className="relative h-64 w-full">
              <Image
                src={post.profilePhoto || '/default-avatar.png'}
                alt={post.fullName}
                fill
                className="object-cover"
              />
              {/* Rasm ustidagi matnlar */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 text-white">
                <h3 className="text-2xl font-bold">{post.fullName}</h3>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">Tug'ilgan: {post.birthDate}</span>
                  <span className="text-sm">Vafot: {post.deathDate}</span>
                </div>
              </div>
            </div>
            
            {/* Kontent qismi */}
            <div className="p-4">
              <p className=" mb-4 italic">"{post.definition}"</p>
              
              <div className="flex justify-between items-center border-t pt-3">
                <div className="flex space-x-4">
                  <button className={`flex items-center space-x-1 ${post.isliked ? 'text-red-500' : ''}`}>
                    <FiHeart className={post.isliked ? 'fill-current' : ''} />
                    <span>{post.likeCount}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <FiMessageSquare />
                    <span>{post.commentCount}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  <FiShare2 />
                  <Link href={post.shareLink} target="_blank" className="text-sm">Ulashish</Link>
                </div>
              </div>
              
              <div className="mt-3 text-xs ">
                <p>Yaratilgan: {format(new Date(post.createdAt), 'dd.MM.yyyy HH:mm')}</p>
                <p>Muallif: {post.createdBy.fullName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {myPosts?.content?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium ">Hozircha postlar mavjud emas</h3>
          <p className=" mt-2">Yangi post yaratish uchun "Yangi post" tugmasini bosing</p>
        </div>
      )}
    </div>
  );
};

export default Page;