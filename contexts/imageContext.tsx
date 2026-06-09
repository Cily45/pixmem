import React, { createContext, useState, useContext } from 'react'

const PhotoContext = createContext<any>(null)

export function PhotoProvider ({ children }: any) {
  const [photos, setPhotos] = useState<string[]>([])

  const addPhoto = (uri: string) => {
    setPhotos((prev) => [...prev, uri])
  }

  return (
    <PhotoContext.Provider value={{ photos, addPhoto }}>
      {children}
    </PhotoContext.Provider>
  )
}

export const usePhotos = () => useContext(PhotoContext)