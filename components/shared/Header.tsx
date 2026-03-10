"use client"
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    const pathName = usePathname()

  return (
    <header>
        <div className='main-container inner'>
            <Link href={'/'} className={cn('nav-link', {'is-active': pathName === '/', 'is-home' : true})}>
                <Image
                    src={'logo.svg'}
                    height={40}
                    width={132}
                    alt='CoinPulse logo'
                />
            </Link>

            <nav>
                <Link href={'/'} className={cn('nav-link',{'is-active': pathName === '/', 'is-home': true})}>Home</Link>
                <p>Search Modal</p>
                <Link href={'/coins'} className={cn('nav-link', {'is-active': pathName === '/coins'})}>All coins</Link>
            </nav>
        </div>
    </header>
  )
}

export default Header