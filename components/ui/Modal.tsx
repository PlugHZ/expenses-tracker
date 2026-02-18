'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                    <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
                    <Button variant="secondary" size="sm" onClick={onClose} className="p-1.5">
                        <X size={16} />
                    </Button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}