"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Textarea } from "../../../../../../components/ui/textarea";
import { Input } from "../../../../../../components/ui/input";
import { Button } from "../../../../../../components/ui/button";

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!id) return;

    // Fetch post data
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setImage(data.image);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, image }),
    });

    router.push("/dashboard/posts");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-5">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <Input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <Button className="w-full">Update Post</Button>
      </form>
    </div>
  );
}
