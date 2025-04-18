'use client'
import { useSearchParams } from 'next/navigation';
import React from 'react';

const Page = () => {
      const searchParams = useSearchParams()
      const id= searchParams.get('id')
      console.log(id);
      
    return (
        <div>
            salom dunyo:id
        </div>
    );
}

export default Page;
