"use client";
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className='bg-white border-b border-gray-200'>
      <nav className=''>
        <div className=''>
          <div className=''></div>
          <div className=''>
            <a href="/home" className=''>home</a>
            <a href="/pricing" className=''>pricing</a>
            <a href="/contact" className=''>contact us</a>
            <a href="/blog" className=''>blog</a>
          </div>
          <div className=''>
            <button className=''>Login</button>
            <button className=''>Signup</button>
          </div>
        </div>
      </nav>
    </header>
  );
}
