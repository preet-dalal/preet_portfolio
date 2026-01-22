export interface Project {
  slug: string
  title: string
  summary: string
  content: string
  images: Record<string, string>
  previewImage: string
  date: string
}
