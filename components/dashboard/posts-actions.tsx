// components/dashboard/posts-actions.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function PostsActions() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force refresh the page to get latest data
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
        <RefreshCw
          className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
        Refresh
      </Button>

      <Button asChild>
        <Link href="/dashboard/posts/create">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Post
        </Link>
      </Button>
    </div>
  );
}
