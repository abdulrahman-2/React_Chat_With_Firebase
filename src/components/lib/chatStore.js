import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";
import { useUserStore } from "./UserStore";

export const chatStore = create((set) => ({
  chatId: null,
  user: true,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState.currentUser;

    // check if current user is blocked?
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: true,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // check if current user is blocked?
    if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !isReceiverBlocked }));
  },
}));
