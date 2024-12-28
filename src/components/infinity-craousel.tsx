'use client'

import React, { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image";

interface CarouselProps {
    images: string[]
}

export default function InfiniteCarousel({ images }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, [images.length])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }, [images.length])

    return (
        <div className="relative w-full max-w-3xl mx-auto group/carousel">
            <div className="overflow-hidden aspect-video">
                {images.map((image, index) => (
                    <Image
                        key={index}
                        src={image}
                        width={1920}
                        height={1080}
                        alt={`Slide ${index + 1}`}
                        className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
                            index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ))}
            </div>

            <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 group-hover/carousel:opacity-100 max-lg:opacity-100 opacity-0 transition-opacity duration-500 ease-in-out"
                onClick={prevSlide}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 group-hover/carousel:opacity-100 max-lg:opacity-100 opacity-0 transition-opacity duration-500 ease-in-out"
                onClick={nextSlide}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    )
}