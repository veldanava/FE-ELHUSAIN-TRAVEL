// components/dashboard/delete-post-button.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { usePosts } from "@/hooks/use-article"; // Assuming you have this hook

interface DeletePostButtonProps {
  postId: number;
  postTitle: string;
}

export default function DeletePostButton({
  postId,
  postTitle,
}: DeletePostButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { deletePost, isDeleting } = usePosts();

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      setIsOpen(false);
      // Refresh the page to reflect changes
      window.location.reload();
    } catch {
      // Error handled in hook (toast.error)
    }
  };

  const isLoading = !!isDeleting;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isLoading}
          title="Hapus Post"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Post</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus post &quot;{postTitle}&quot;?
            Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data
            terkait post ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Post
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
