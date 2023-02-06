export interface IProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Like {
  user: string;
}

interface Comment {
  user: string;
  content: string;
}

export interface IPost {
  _id: string;
  user: string;
  content: string;
  likes: [Like];
  comments: [Comment];
}
