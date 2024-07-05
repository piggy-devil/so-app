import prisma from "@/lib/db";
import CommentList from "./CommentList";

type Props = {
  postId: string;
};

const Comments = async ({ postId }: Props) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: true,
    },
  });

  return (
    <div>
      {/* WRITE */}
      <CommentList comments={comments} postId={postId} />
    </div>
  );
};

export default Comments;
