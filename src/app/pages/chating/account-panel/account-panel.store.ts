import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { Account } from '../../../types';
import { computed } from '@angular/core';

type AccountPanelState = {
    account: Account;
    selectedChatId: number | null;
};

const initialState: AccountPanelState = {
    account: null!,
    selectedChatId: null,
};

export const AccountPanelStore = signalStore(
    withState(initialState),

    withComputed(({ account, selectedChatId }) => ({
        curChat: computed(() => {
            const acc = account();
            const id = selectedChatId();
            if (!id) return null;
            return acc.chats.find((c) => c.id === id) ?? null;
        }),
    })),
    withMethods((store) => ({
        updateAccount(account: Account) {
            patchState(store, () => ({
                account: account,
            }));
        },
        updateSelectedChatId(chatId: number | null) {
            patchState(store, () => ({
                selectedChatId: chatId,
            }));
        },
    })),
);
