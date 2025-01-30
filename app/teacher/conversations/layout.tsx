import SideBar from "../chats/components/sidebar/SideBar";
import ConversationList from "./components/ConversationList";

const ConversationsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SideBar>
      <div className="dark:bg-[#111] h-full">
        <ConversationList />
        {children}
      </div>
    </SideBar>
  );
};

export default ConversationsLayout;
