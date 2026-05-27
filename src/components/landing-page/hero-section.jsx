'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/logo'
import AnimatedHero from './animated-hero'

const navigation = [
  { name: 'Guides', href: 'guides' },
  { name: 'Pricing', href: 'pricing' },
  { name: 'About Us', href: 'about' },
  { name: 'Contact', href: 'contact' },
]

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredNavigation, setHoveredNavigation] = useState(null)
  const reduced = useReducedMotion()

  return (
    <div className="bg-white">
      <motion.header className="landing-navbar absolute inset-x-0 top-0 z-50" initial={{ opacity: 0, y: reduced ? 0 : -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/" className="navbar-brand -m-1.5 p-1.5">
              <span className="sr-only">BulkMailer</span>
              <Logo />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="navbar-menu-toggle -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className='navbar-pill hidden lg:inline bg-background border-opacity-50 rounded-full px-5 py-1 border border-muted-foreground shadow-lg'>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link key={item.name} href={`/${item.href}`} className="navbar-link text-sm/6 font-semibold text-gray-900 hover:drop-shadow animation duration-500" onPointerEnter={() => setHoveredNavigation(item.name)} onPointerLeave={() => setHoveredNavigation(null)} onFocus={() => setHoveredNavigation(item.name)} onBlur={() => setHoveredNavigation(null)}>
                  {hoveredNavigation === item.name && <motion.span className="navbar-link-highlight" layoutId="navbar-link-highlight" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }} aria-hidden="true" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/auth/login" className="navbar-login text-sm/6 font-semibold text-gray-900">
              <span>Log In</span> <span className="navbar-login-arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel as={motion.div} initial={{ opacity: 0, x: reduced ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} className="navbar-mobile-panel fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">BulkMailer</span>
                <Logo />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={`/${item.href}`}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/auth/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </motion.header>

      <AnimatedHero />
    </div>
  )
}
