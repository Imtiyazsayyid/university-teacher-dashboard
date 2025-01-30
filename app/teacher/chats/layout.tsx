import SideBar from "./components/sidebar/SideBar";
import UserList from "./components/UserList";

const Userlayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SideBar>
      <div className="h-full">
        <UserList />
        {children}
      </div>
    </SideBar>
  );
};

export default Userlayout;
