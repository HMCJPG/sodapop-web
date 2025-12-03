import React from 'react';
import { DEFAULT_EVENT_IMAGES } from '@/lib/defaultEventImages';

interface ImageSelectorProps {
    selectedImage: string;
    onSelect: (imageUrl: string) => void;
}

export default function ImageSelector({ selectedImage, onSelect }: ImageSelectorProps) {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {DEFAULT_EVENT_IMAGES.map((url, index) => {
                const isSelected = selectedImage === url;
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onSelect(url)}
                        className={`relative aspect-square w-full overflow-hidden rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isSelected
                                ? 'ring-4 ring-purple-500 ring-offset-2 scale-95'
                                : 'hover:opacity-80 hover:scale-105'
                            }`}
                    >
                        <img
                            src={url}
                            alt={`Event option ${index + 1}`}
                            className="h-full w-full object-cover"
                        />
                        {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="rounded-full bg-white p-1 shadow-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-6 w-6 text-purple-600"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
