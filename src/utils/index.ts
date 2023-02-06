import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  apiVersion: "2023-02-04",
  dataset: "production",
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN,
});

export const fetchProduct = `*[_type == "product"] {
  _id,
  name,
  image,
  price,
  quantity
}`;

export const fetchPost = `*[_type == "post"]{
  _id,
  user,
  content,
  likes,
  comments
}`;
