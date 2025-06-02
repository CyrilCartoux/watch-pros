import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, CheckCircle2, MessageSquare } from "lucide-react"
import { useState } from "react"

export interface ReviewData {
  rating: number
  comment: string
}

export interface ReviewDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (review: ReviewData) => Promise<void>
  title: string
  description?: string
  isSubmitting?: boolean
}

export function ReviewDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  isSubmitting = false
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = async () => {
    if (rating === 0) return
    await onSubmit({ rating, comment })
    setRating(0)
    setComment("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center text-base">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {rating === 0 ? (
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Overall Rating</Label>
                <div className="flex items-center gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          value <= (hoveredRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-base font-medium">Your review</Label>
                <div className="relative">
                  <Textarea
                    id="comment"
                    placeholder="Share your experience with this seller..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                  <MessageSquare className="absolute bottom-3 right-3 h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-right">
                  {comment.length} / 1000 characters
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="relative">
                <CheckCircle2 className="w-16 h-16 text-primary animate-in zoom-in-50 duration-500" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              </div>
              <p className="text-lg font-medium text-center">Your review has been submitted successfully!</p>
              <p className="text-sm text-muted-foreground text-center">
                Thank you for sharing your experience.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {rating === 0 && (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="hover:bg-muted"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? "Submitting..." : "Submit review"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 