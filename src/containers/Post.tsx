import React, { useState, useEffect } from "react";
import {
  AiOutlineUser,
  AiOutlineComment,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { IPost } from "../types";
import { client, fetchPost } from "../utils";
import { v4 as uuidv4 } from "uuid";

export default function Post() {
  const [post, setPost] = useState<IPost | null>(null);
  const [comment, setComment] = useState("");
  const findLike = post?.likes?.find((like) => like?.user === "admin");

  const getPost = async () => {
    await client
      .fetch(fetchPost)
      .then((data) => {
        setPost(data[0]);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getPost();
  }, []);

  const handleLike = async (id: any) => {
    if (!findLike) {
      await client
        .patch(id)
        .setIfMissing({ likes: [] })
        .insert("after", "likes[-1]", [
          { _type: "like", _key: uuidv4(), user: "admin" },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    } else {
      return null;
    }
  };

  const createComment = async (id: any) => {
    await client
      .patch(id)
      .setIfMissing({ comments: [] })
      .insert("after", "comments[-1]", [
        {
          _type: "comment",
          _key: uuidv4(),
          user: "admin",
          content: comment,
        },
      ])
      .commit()
      .then(() => {
        setComment("");
        window.location.reload();
      });
  };
  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-screen grid place-items-center">
        <div className="w-4/5 bg-gray-200 p-4 rounded-lg flex justify-start items-start flex-col gap-2">
          <div className="w-full flex justify-start items-center gap-2">
            <div className="p-2 bg-gray-300 rounded-full">
              <AiOutlineUser />
            </div>
            <p>{post?.user}</p>
          </div>
          <p>{post?.content}</p>
          <div className="w-full flex justify-end items-center gap-[1em]">
            <div className="flex items-center gap-1">
              {findLike ? (
                <AiFillHeart
                  className="text-rose-500"
                  onClick={() => handleLike(post?._id)}
                />
              ) : (
                <AiOutlineHeart onClick={() => handleLike(post?._id)} />
              )}
              <p>{!post?.likes ? 0 : post?.likes?.length}</p>
            </div>
            <div className="flex items-center gap-1">
              <AiOutlineComment />
              <p>{!post?.comments ? 0 : post?.comments?.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-screen flex flex-col justify-between items-center">
        <div className="w-full h-full px-[5vw] flex justify-start items-center flex-col py-2 gap-2">
          {post?.comments?.map((comment, index) => (
            <div
              className="w-full flex justify-start items-start flex-col gap-2 p-2 bg-gray-200 rounded-lg"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-300 rounded-full">
                  <AiOutlineUser />
                </div>
                <p>{comment?.user}</p>
              </div>
              <p>{comment?.content}</p>
            </div>
          ))}
        </div>
        <form
          className="w-full py-2 flex justify-between items-center px-[5vw] gap-2"
          onSubmit={() => createComment(post?._id)}
        >
          <input
            className="w-full border-none outline-none py-2"
            type="text"
            placeholder="Comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <button
            className="px-4 py-2 bg-cyan-500 rounded-lg text-white border-none outline-none"
            type="submit"
            disabled={comment.replace(/\s/g, "").length === 0}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
