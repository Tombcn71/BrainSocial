"use client";

import ContentItem from "./content-item";

export default function ContentOverview({ content = [] }: { content: any[] }) {
  // Ensure content is always an array
  const safeContent = Array.isArray(content) ? content : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {safeContent.map((item) => (
        <ContentItem key={item.id} item={item} />
      ))}
    </div>
  );
}
