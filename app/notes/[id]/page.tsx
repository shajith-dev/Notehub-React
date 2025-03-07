"use client";
import { useParams } from "next/navigation";
import NotePage from "@/app/components/NotePage";

export default function Note() {
  const params = useParams();
  return <NotePage noteId={Number(params.id)} />;
}
