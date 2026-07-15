/**
 * Optional looping background videos.
 *
 * To add one: drop the file into `public/videos/` and add an entry here. The
 * VideoBackground layer plays a random configured video behind the 3D brain,
 * or renders nothing at all when this list is empty (the default today).
 */
export interface BackgroundVideo {
  /** Path relative to the app base, e.g. 'videos/nebula.mp4'. */
  src: string
  /** Optional poster image shown until the video can play, e.g. 'videos/nebula.webp'. */
  poster?: string
  /** MIME type; defaults to 'video/mp4'. Use 'video/webm' for .webm files. */
  type?: string
}

export const BACKGROUND_VIDEOS: readonly BackgroundVideo[] = [
  // { src: 'videos/nebula.mp4', poster: 'videos/nebula.webp' },
]
