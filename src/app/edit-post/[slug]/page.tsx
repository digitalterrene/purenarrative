import EditPost from "@/components/edit-post/EditPost";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: "Edit Post",
  description: "Edit your existing blog post",
};
export default function Page({ params }: PageProps) {
  const slug = params.slug;
  return <EditPost slug={slug} />;
}
