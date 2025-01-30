import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    const id = Number(params?.conversationId); // No need for `String()`
    return !isNaN(id) && id > 0 ? id : null; // Return `null` if invalid
  }, [params?.conversationId]);

  const isOpen = useMemo(() => conversationId !== null, [conversationId]);

  return useMemo(() => ({ isOpen, conversationId }), [isOpen, conversationId]);
};

export default useConversation;
