import { Channel, Members } from "pusher-js";
// // import { pusherClient } from "../libs/pusher";

import { useEffect, useState } from "react";
import useActiveList from "./useActiveList";

// interface Member {
//   id: string;
//   name?: string;
// }

// // actual type -> Record<string, any>

// const useActiveChannel = () => {
//   const { add, remove, set } = useActiveList();
//   const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

//   useEffect(() => {
//     let channel = activeChannel;

//     if (!channel) {
//       // channel = pusherClient.subscribe("presence-messenger");
//       setActiveChannel(channel);
//     }

//     // this is binds all the active users
//     channel.bind("pusher:subscription_succeeded", (members: Members) => {
//       const initialMembers: string[] = [];

//       members.each((member: Member) => initialMembers.push(member.id));
//       set(initialMembers);
//     });

//     channel.bind("pusher:member_added", (member: Member) => {
//       add(member.id);
//     });

//     channel.bind("pusher:member_removed", (member: Member) => {
//       remove(member.id);
//     });

//     return () => {
//       if (activeChannel) {
//         pusherClient.unsubscribe("presence-messenger");
//         setActiveChannel(null);
//       }
//     };
//   }, [activeChannel, set, add, remove]);
// };

// export default useActiveChannel;


/// Pusher

// const useActiveChannel = () => {
//   const { set, add, remove } = useActiveList();
//   const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

//   useEffect(() => {
//     let channel = activeChannel;

//     if(!channel) {
//       channel = pusherClient.subscribe('presence-unichat');
//       setActiveChannel(channel);
//     }

//     channel?.bind('pusher:subscription_succeeded', (members: Members) => {
//       const initialMembers: string[] = [];

//       members.each((member: Record<string, any>) => initialMembers.push(member.id))
//     })

//     channel?.bind("pusher:member_added", (member: Record<string, any>) => {
//       add(member.id);
//     });

//     channel?.bind("pusher:member_remove", (member: Record<string, any>) => {
//       remove(member.id)
//     });

//     return () => {
//       if(activeChannel) {
//         pusherClient.unsubscribe("presence-unichat");
//         setActiveChannel(null);
//       }
//     }
//   }, [activeChannel, set, add, remove])
// };

// export default useActiveChannel;


const useActiveChannel = () => {}

export default useActiveChannel