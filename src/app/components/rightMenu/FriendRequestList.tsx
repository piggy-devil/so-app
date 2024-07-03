"use client";

import Image from "next/image";
import { acceptFollowRequest, declineFollowRequest } from "@/lib/actions";
import { FollowRequest, User } from "@prisma/client";
import { useOptimistic, useState } from "react";

type RequestWithUser = FollowRequest & {
  sender: User;
};

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
  const [requestState, setRequestState] = useState(requests);

  const accept = async (requestId: string, userId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await acceptFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {}
  };
  const decline = async (requestId: string, userId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await declineFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {}
  };

  const [optimisticRequests, removeOptimisticRequest] = useOptimistic(
    requestState,
    (state, value: string) => state.filter((req) => req.id !== value)
  );

  return (
    <div>
      {optimisticRequests.map((request) => (
        <div key={request.id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={request.sender.avatar || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold">
              {request.sender.name && request.sender.surname
                ? `${request.sender.name} ${request.sender.surname}`
                : request.sender.username}
            </span>
          </div>
          <div className="flex gap-3 justify-end">
            <form action={() => accept(request.id, request.sender.id)}>
              <button>
                <Image
                  src="/accept.png"
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5 cursor-pointer"
                />
              </button>
            </form>
            <form action={() => decline(request.id, request.sender.id)}>
              <button>
                <Image
                  src="/reject.png"
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5 cursor-pointer"
                />
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;
