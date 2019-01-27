export interface TrackUpload {
    name: string
    description: string
    file: File | undefined
    isDownloadable: boolean
    isExplicit: boolean
    tags: string[]
}

export interface TrackUploadProps {
    uploadTrack: (data: TrackUpload) => {}
}
